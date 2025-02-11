import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Utilizzo di cookieParser per il parsing dei cookie
  app.use(cookieParser());

  // Impostazioni di sicurezza per i CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Modifica questo URL in base alle tue necessità
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Porta di ascolto
  await app.listen(3001, () => {
    Logger.log('Backend is running on http://localhost:3001');
  });
}

bootstrap();
