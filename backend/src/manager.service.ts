// src/manager.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manager } from './manager.entity';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
  ) {}

  // Metodo per ottenere il Manager in base all'ID
  async getManager(id: number): Promise<Manager> {
    return await this.managerRepository.findOne({ where: { id } });
  }

  // Metodo per creare un nuovo Manager
  async createManager(data: Partial<Manager>): Promise<Manager> {
    const manager = this.managerRepository.create(data);
    return await this.managerRepository.save(manager);
  }
}
