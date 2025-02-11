// src/checkin/checkin.module.ts
import { Module } from '@nestjs/common';
import { CheckinService } from './checkin.service';  // Assicurati che il servizio esista
import { CheckinController } from './checkin.controller';  // Assicurati che il controller esista
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checkin } from './checkin.entity';  // Assicurati che l'entità esista

@Module({
  imports: [TypeOrmModule.forFeature([Checkin])],  // Includi l'entità Checkin per TypeORM
  controllers: [CheckinController],  // Aggiungi il controller per il check-in
  providers: [CheckinService],  // Aggiungi il servizio per il check-in
})
export class CheckinModule {}
