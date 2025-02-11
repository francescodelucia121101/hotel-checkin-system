import { EntityRepository, Repository } from 'typeorm';
import { Manager } from './manager.entity';

@EntityRepository(Manager)
export class ManagerRepository extends Repository<Manager> {
  // Puoi aggiungere metodi personalizzati per l'interazione con il database, se necessario
  // Esempio:
  // async findById(id: number): Promise<Manager | null> {
  //   return this.findOne({ where: { id } });
  // }
}
