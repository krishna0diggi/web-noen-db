import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from '../dto/register.dto';
import { Role } from '../entities/role.entity';

interface DecodedToken {
  id: string;
  name: string;
  phone: string;
  role: string;
}

@Injectable()
export class AuthService {
  public jwtSecret = process.env.JWT_SECRET;
  constructor(
    @InjectRepository(User)
    private user: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>
  ) {}
  async login(lognidto: LoginDto): Promise<{
    user: { id: number; name: string; phone: string; role: string };
    token: string;
  }> {
    const { phone, password } = lognidto;

    const user = await this.user.findOne({
      where: { phone },
      relations: ['role'], // ✅ must include this
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('User is not verified');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!this.jwtSecret) {
      throw new BadRequestException('JWT secret is not set');
    }

    const currentRole = user.role.name;
    const token = jwt.sign(
      { name: user.name, phone: user.phone, role: currentRole },
      this.jwtSecret,
      { expiresIn: '1d' }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: currentRole,
      },
      token,
    };
  }

  async register(registerdto: RegisterDto): Promise<{ message: string }> {
    const existingUser = await this.user.findOne({
      where: { phone: registerdto.phone },
    });
    if (existingUser) {
      return { message: 'User Registered Successfully' };
    }
    const role = await this.roleRepo.findOne({
      where: { id: registerdto.role_id },
    });
    if (!role) {
      throw new BadRequestException('Invalid role ID');
    }
    const hashedPassword = await bcrypt.hash(registerdto.password, 10);
    const newUser = {
      name: registerdto.name,
      phone: registerdto.phone,
      password: hashedPassword,
      otp: registerdto.otp.toString(),
      role: role,
      isVerified: false,
      otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
      address: registerdto.address,
    };
    // const newUser = this.user.create({ ...registerdto, password: hashedPassword });
    await this.user.save(newUser);
    return { message: 'User Registered Successfully' };
  }

  async verifyPhone(phone: string) {
    const user = await this.user.findOne({ where: { phone } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.isVerified) {
      throw new UnauthorizedException('User is not verified');
    }
    return user;
  }

  async getCurrentUser(authHeader: string): Promise<any> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const decoded = jwt.verify(
        token,
        this.jwtSecret as string
      ) as DecodedToken;

      const employee = await this.user.findOne({
        where: { phone: decoded.phone },
        relations: ['role'],
      });

      if (!employee) {
        throw new UnauthorizedException('User not found');
      }

      const userWithoutSensitiveData = {
        id: employee.id,
        name: employee.name,
        phone: employee.phone,
        address: employee.address, // ✅ Add this line
        role: employee.role.name,
      };

      return userWithoutSensitiveData;
    } catch (error) {
      throw new UnauthorizedException('Token is invalid or expired');
    }
  }
}
