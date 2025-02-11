import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { WubookService } from './wubook.service';

@Controller('checkin')
export class CheckinController {
  constructor(
    private readonly checkinService: CheckinService,
    private readonly wubookService: WubookService,
  ) {}

  @Get()
  async getAllCheckins() {
    return this.checkinService.findAll();
  }

  @Get(':id')
  async getCheckin(@Param('id') id: number) {
    return this.checkinService.findOne(id);
  }

  @Post()
  async createCheckin(@Body() checkinData: any) {
    return this.checkinService.create(checkinData);
  }

  @Get('wubook/test')
  async testWubook() {
    return this.wubookService.someMethod();
  }
}
