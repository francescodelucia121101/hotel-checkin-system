nimport { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckinController } from './checkin.controller';
import { CheckinService } from './checkin.service';
import { Checkin } from './checkin.entity';
import { WubookModule } from '../checkin/wubook.module'; // <-- Importa il modulo Wubook



@Module({
  imports: [TypeOrmModule.forFeature([Checkin])], // Aggiunto il repository Checkin
  providers: [CheckinService],
  controllers: [CheckinController],
  exports: [CheckinService],
})
export class CheckinModule {}
