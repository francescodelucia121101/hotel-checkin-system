// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';  // Assicurati che il file esista
// import { AppService } from './app.service';  // Assicurati che il file esista
import { ManagerModule } from './manager/manager.module';  // Assicurati che il modulo esista
import { WubookModule } from './checkin/wubook.module';  // Assicurati che il modulo esista
import { CheckinModule } from './checkin/checkin.module';  // Assicurati che il modulo esista
import { TypeOrmModule } from '@nestjs/typeorm';  // Importa TypeOrmModule
import { Checkin } from './checkin/checkin.entity';  // Importa la tua entità Checkin

@Module({
  imports: [
    ManagerModule,  // Aggiungi qui i tuoi moduli
    WubookModule,   // Aggiungi il modulo per l'integrazione con Wubook
    CheckinModule,  // Aggiungi il modulo per il check-in
    TypeOrmModule.forRoot({
      type: 'postgres', // Cambia se usi un altro database
      host: 'localhost',
      port: 5432,
      username: 'hotel',
      password: 'Delvi2024!',
      database: 'hotel',
      entities: [Checkin],
      synchronize: true, // Solo per sviluppo, rimuovi in produzione
    })
  ],
  controllers: [AppController],  // Controller di base
  // providers: [AppService],       // Servizi di base
})
export class AppModule {}
