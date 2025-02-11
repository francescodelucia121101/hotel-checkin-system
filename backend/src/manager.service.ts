import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manager } from './manager.entity';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,
  ) {}

  async registerHotel(data: any): Promise<Manager> {
    const manager = new Manager();
    manager.hotelName = data.hotelName;
    manager.managerEmail = data.managerEmail;
    manager.password = data.password;  // Cripta la password prima di salvarla
    manager.wubookApiKey = data.wubookApiKey;
    manager.stripeApiKey = data.stripeApiKey;
    manager.hikvisionApiKey = data.hikvisionApiKey;

    return await this.managerRepository.save(manager);
  }

  async updateSettings(managerId: number, data: any): Promise<Manager> {
    const manager = await this.managerRepository.findOne(managerId);
    if (manager) {
      manager.hotelName = data.hotelName;
      manager.wubookApiKey = data.wubookApiKey;
      manager.stripeApiKey = data.stripeApiKey;
      manager.hikvisionApiKey = data.hikvisionApiKey;

      return await this.managerRepository.save(manager);
    }
    throw new Error('Manager non trovato');
  }
}
