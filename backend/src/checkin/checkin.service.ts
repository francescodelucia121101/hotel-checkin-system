import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkin } from './checkin.entity';
import { CheckinDto } from './checkin.dto';

@Injectable()
export class CheckinService {
  constructor(
    @InjectRepository(Checkin)
    private readonly checkinRepository: Repository<Checkin>,
  ) {}

  // Metodo per creare un nuovo check-in
  async create(checkinData: CheckinDto): Promise<Checkin> {
    // Creiamo un'istanza dell'entità Checkin usando i dati inviati
    const newCheckin = this.checkinRepository.create(checkinData);

    // Salviamo il nuovo Checkin nel database
    return this.checkinRepository.save(newCheckin);
  }

  // Metodo per recuperare un singolo check-in
  async findOne(id: number): Promise<Checkin | null> {
    return this.checkinRepository.findOne({ where: { id } });
  }
}
