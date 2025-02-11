import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkin } from './checkin.entity';

@Injectable()
export class CheckinService {
  constructor(
    @InjectRepository(Checkin)
    private readonly checkinRepository: Repository<Checkin>,
  ) {}

  async findAll(): Promise<Checkin[]> {
    return this.checkinRepository.find();
  }

  async findOne(id: number): Promise<Checkin | null> {
    // Aggiungiamo l'oggetto di opzioni corretto per la ricerca
    return this.checkinRepository.findOne({ where: { id } });
  }

  async create(checkinData: any): Promise<Checkin> {
    // Creiamo un'istanza dell'entità e la salviamo
    const newCheckin = this.checkinRepository.create(checkinData);
    return this.checkinRepository.save(newCheckin);  // Salviamo un singolo oggetto, non un array
  }
}
