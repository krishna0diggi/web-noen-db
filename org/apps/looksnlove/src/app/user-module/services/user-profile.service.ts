import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async getProfile(userId: number) {
    if (!userId || typeof userId !== 'number' || isNaN(userId) || userId <= 0) {
      throw new NotFoundException("Invalid or missing user ID");
    }
    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ["role"] });
    if (!user) throw new NotFoundException("User not found");
    const { id, name, phone, address, role } = user;
    return { id, name, phone, role: role?.name, address: address };
  }

  async updateProfile(userId: number, dto: Partial<User>) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");
    if (dto.name) user.name = dto.name;
    if (dto.phone) user.phone = dto.phone;
    if (dto.address !== undefined) user.address = dto.address;
    await this.userRepo.save(user);
    const { id, name, phone, address } = user;
    return { id, name, phone, address };
  }
}
