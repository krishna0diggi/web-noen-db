// category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Service } from './service.desc.entity';
@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string; // <-- New Field

  @Column({ nullable: true })
  description!: string;

  @OneToMany(() => Service, (service) => service.category)
  services!: Service[];
}
