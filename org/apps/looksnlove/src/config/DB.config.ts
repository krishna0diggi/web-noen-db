import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { User } from '../app/user-module/entities/user.entity';
import { Role } from '../app/user-module/entities/role.entity';
dotenv.config();
export const DB_CONFIG: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,

  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  entities: [User, Role],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false, // required when connecting to self-signed SSL certs
  },
};
