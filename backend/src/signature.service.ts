import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SignatureService {
  async saveSignature(signature: string) {
    // Salvataggio della firma in formato immagine
    const filePath = path.join(__dirname, '..', 'uploads', 'signatures', `${Date.now()}.png`);
    const base64Data = signature.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(filePath, base64Data, 'base64');
    return filePath;
  }
}
