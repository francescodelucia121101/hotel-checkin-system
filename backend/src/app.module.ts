// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';  // Assicurati che il file esista
import { AppService } from './app.service';  // Assicurati che il file esista
import { ManagerModule } from './manager/manager.module';  // Assicurati che il modulo esista
import { WubookModule } from './wubook/wubook.module';  // Assicurati che il modulo esista
import { CheckinModule } from './checkin/checkin.module';  // Assicurati che il modulo esista

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
