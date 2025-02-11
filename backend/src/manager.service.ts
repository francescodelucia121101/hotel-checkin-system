import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manager } from './manager.entity';
import { ManagerRepository } from './manager.repository';  // Assicurati che il repository esista

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Manager)
    private readonly managerRepository: ManagerRepository  // Assicurati che il repository esista
  ) {}

  async createManager(data: any): Promise<Manager> {
    // Crea una nuova istanza di Manager utilizzando il costruttore
    const newManager = new Manager(
      data.id,
      data.hotelName,
      data.managerEmail,
      data.password,
      data.wubookApiKey,
      data.stripeApiKey,
      data.hikvisionApiKey
    );

    // Salva il nuovo manager nel repository (o database)
    return await this.managerRepository.save(newManager);
  }

  async getManager(id: number): Promise<Manager | null> {
    // Trova un manager per ID
    return await this.managerRepository.findOne({ where: { id } });
  }
}
