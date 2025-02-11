import { Injectable } from '@nestjs/common';
import { Manager } from './manager.entity';
import { ManagerRepository } from './manager.repository'; // Assumendo che tu abbia un repository

@Injectable()
export class ManagerService {
  constructor(
    private readonly managerRepository: ManagerRepository, // Repository di Manager
  ) {}

  // Trova un manager per ID, restituendo null se non trovato
  async getManager(id: number): Promise<Manager | null> {
    const manager = await this.managerRepository.findOne({ where: { id } });
    if (!manager) {
      // Gestisci caso in cui non viene trovato
      throw new Error(`Manager con id ${id} non trovato.`);
    }
    return manager;
  }
}
