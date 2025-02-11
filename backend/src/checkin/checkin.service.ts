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
    return this.checkinRepository.findOne({ where: { id } });
  }

  async create(checkinData: any): Promise<Checkin> {
    // Verifica che 'checkinData' sia un oggetto e non un array
    const newCheckin = this.checkinRepository.create(checkinData);
    return this.checkinRepository.save(newCheckin);  // Salviamo un singolo oggetto Checkin
  }
}
