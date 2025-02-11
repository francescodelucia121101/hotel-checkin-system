// src/wubook/wubook.module.ts
import { Module } from '@nestjs/common';
import { WubookService } from './wubook.service';  // Assicurati che il servizio esista
import { WubookController } from './wubook.controller';  // Assicurati che il controller esista

@Module({
  controllers: [WubookController],  // Aggiungi il controller per Wubook
  providers: [WubookService],  // Aggiungi il servizio per Wubook
})
export class WubookModule {}
