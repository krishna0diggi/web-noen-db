// service.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string; // e.g. VLCC Anti-Aging Facial

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column('simple-array')
  features!: string[]; // e.g. ['Steaming', 'Blackhead Removal']

  @Column()
  price!: number;

  @Column({ nullable: true })
  discountedPrice!: number;

  @Column()
  durationInMinutes!: number;

  @Column({ nullable: true })
  image!: string;

  @ManyToOne(() => Category, category => category.services)
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @Column({ default: true })
  isAvailable!: boolean;
}
