import { Injectable } from '@nestjs/common';
import { Manager } from './manager.entity';
import { ManagerRepository } from './manager.repository'; // Assicurati che il repository esista e venga importato

@Injectable()
export class ManagerService {
  constructor(private readonly managerRepository: ManagerRepository) {}

  // Trova un manager per ID, gestendo il caso in cui non esiste
  async getManager(id: number): Promise<Manager | null> {
    const manager = await this.managerRepository.findOne({ where: { id } });
    if (!manager) {
      return null;
    }
    return manager;
  }

  // Metodo per creare un manager
  async createManager(data: any): Promise<Manager> {
    const newManager = new Manager();
    newManager.id = data.id;
    newManager.hotelName = data.hotelName;
    newManager.managerEmail = data.managerEmail;
    newManager.password = data.password;
    newManager.wubookApiKey = data.wubookApiKey;
    newManager.stripeApiKey = data.stripeApiKey;
    newManager.hikvisionApiKey = data.hikvisionApiKey;

    // Salva il nuovo manager nel repository (o database)
    return await this.managerRepository.save(newManager);
  }
}
