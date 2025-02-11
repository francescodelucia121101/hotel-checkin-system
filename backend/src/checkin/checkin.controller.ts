import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { CheckinDto } from './checkin.dto';
import { Checkin } from './checkin.entity';

@Controller('checkin')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  // Metodo per creare un nuovo check-in
  @Post()
  async create(@Body() checkinData: CheckinDto): Promise<Checkin> {
    return this.checkinService.create(checkinData);
  }

  // Metodo per ottenere un check-in per id
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Checkin | null> {
    return this.checkinService.findOne(id);
  }
}
