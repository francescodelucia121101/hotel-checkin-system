import { Controller, Post, Body } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { WubookService } from './wubook.service';
import { AccessService } from './access.service';
import { SignatureService } from './signature.service';

@Controller('checkin')
export class CheckinController {
  constructor(
    @Inject(WubookService) private wubookService: WubookService,
    @Inject(AccessService) private accessService: AccessService,
    @Inject(SignatureService) private signatureService: SignatureService,
  ) {}

  @Post()
  async checkIn(@Body() body: any) {
    try {
      // Verifica la prenotazione su Wubook
      const reservation = await this.wubookService.getReservation(body.reservationCode);
      
      if (!reservation) {
        throw new Error('Prenotazione non trovata');
      }

      // Gestione della firma
      const signatureFile = await this.signatureService.saveSignature(body.signature);
      
      // Genera il codice d'accesso tramite HIKVISION
      const accessCode = await this.accessService.generateAccessCode(reservation.roomId);

      return {
        success: true,
        message: 'Check-in completato',
        accessCode,
      };
    } catch (error) {
      console.error('Error during check-in:', error);
      throw new Error('Check-in fallito');
    }
  }
}
