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

  async findOne(id: number): Promise<Checkin> {
    return this.checkinRepository.findOne(id); // Metodo per recuperare un singolo check-in
  }

  async create(checkinData: any): Promise<Checkin> {
    const newCheckin = this.checkinRepository.create(checkinData);
    return this.checkinRepository.save(newCheckin); // Metodo per creare un nuovo check-in
  }
}
