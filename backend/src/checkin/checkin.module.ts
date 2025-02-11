import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checkin } from './checkin.entity';
import { CheckinService } from './checkin.service';
import { CheckinController } from './checkin.controller';
import { WubookModule } from './wubook.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Checkin]),
    WubookModule, // 🔥 Importa WubookModule per poter usare WubookService
  ],
  controllers: [CheckinController],
  providers: [CheckinService],
  exports: [CheckinService],
})
export class CheckinModule {}
