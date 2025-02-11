// src/manager/manager.module.ts
import { Module } from '@nestjs/common';
import { ManagerController } from './manager.controller';  // Assicurati che il controller esista
import { ManagerService } from './manager.service';  // Assicurati che il servizio esista
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager } from './manager.entity';  // Assicurati che l'entità esista

@Module({
  imports: [TypeOrmModule.forFeature([Manager])],  // Includi l'entità Manager per TypeORM
  controllers: [ManagerController],  // Aggiungi il controller del manager
  providers: [ManagerService],  // Aggiungi il servizio del manager
})
export class ManagerModule {}
