import { Controller, Post, Body } from '@nestjs/common';
import { WubookService } from './wubook.service';

@Controller('checkin')
export class CheckinController {
  constructor(private readonly wubookService: WubookService) {}

  @Post('reservation')
  async getReservation(@Body() body: { reservationCode: string }) {
    const reservation = await this.wubookService.getReservation(body.reservationCode);
    return reservation;
  }
}
