import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckinService } from './checkin.service';
import { CheckinController } from './checkin.controller';
import { Checkin } from './checkin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Checkin])], // Aggiunto il repository Checkin
  providers: [CheckinService],
  controllers: [CheckinController],
  exports: [CheckinService],
})
export class CheckinModule {}
