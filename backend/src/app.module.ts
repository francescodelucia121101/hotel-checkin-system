// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManagerModule } from './manager/manager.module'; // Modulo del manager
import { WubookModule } from './wubook/wubook.module'; // Modulo di Wubook
import { CheckinModule } from './checkin/checkin.module'; // Modulo per il check-in

@Module({
  imports: [
    ManagerModule,  // Aggiungi qui i tuoi moduli
    WubookModule,   // Aggiungi il modulo per l'integrazione con Wubook
    CheckinModule,  // Aggiungi il modulo per il check-in
  ],
  controllers: [AppController],  // Controller di base
  providers: [AppService],       // Servizi di base
})
export class AppModule {}
