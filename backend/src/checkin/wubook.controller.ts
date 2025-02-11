import { Controller } from '@nestjs/common';
import { WubookService } from './wubook.service';

@Controller('wubook')
export class WubookController {
  constructor(private readonly wubookService: WubookService) {}

  // Aggiungi qui i metodi per gestire le rotte Wubook
}
