import { Module } from '@nestjs/common';
import { WubookService } from './wubook.service';
import { WubookController } from './wubook.controller';

@Module({
  providers: [WubookService],
  controllers: [WubookController],
  exports: [WubookService], // 🔥 Esposto per essere usato in altri moduli
})
export class WubookModule {}
