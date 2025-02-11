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

  async createCheckin(data: Partial<Checkin>): Promise<Checkin> {
    const newCheckin = this.checkinRepository.create(data);
    return this.checkinRepository.save(newCheckin);
  }

  async findAll(): Promise<Checkin[]> {
    return this.checkinRepository.find();
  }
}
