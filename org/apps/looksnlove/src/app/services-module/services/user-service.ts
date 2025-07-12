// services.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../entities/service.desc.entity';
import { Category } from '../entities/category.entity';
import { UpdateServiceDto } from '../dto/update-services.dto';
import { CreateServiceDto } from '../dto/create-services.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,

    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  // Create service under a category
  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const category = await this.categoryRepo.findOneBy({ id: createServiceDto.categoryId });
    if (!category) throw new NotFoundException('Category not found');

    const service = this.serviceRepo.create({
      ...createServiceDto,
      category,
    });

    return this.serviceRepo.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.serviceRepo.find({ relations: ['category'] });
  }
  
  async findByCategory(categoryId: number) {
  return this.serviceRepo.find({
    where: { category: { id: categoryId } },
    relations: ['category'],
  });
}


  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepo.findOne({ where: { id }, relations: ['category'] });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async update(id: number, updateDto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);

    if (updateDto.categoryId) {
      const category = await this.categoryRepo.findOneBy({ id: updateDto.categoryId });
      if (!category) throw new NotFoundException('Category not found');
      service.category = category;
    }

    Object.assign(service, updateDto);
    return this.serviceRepo.save(service);
  }

  async remove(id: number): Promise<void> {
    const service = await this.findOne(id);
    await this.serviceRepo.remove(service);
  }
}
