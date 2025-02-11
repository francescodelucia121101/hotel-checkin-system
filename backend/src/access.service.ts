import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AccessService {
  async generateAccessCode(roomId: string) {
    // Chiamata per generare un codice d'accesso con HIKVISION
    try {
      const response = await axios.post('https://hikvision.api.url', {
        roomId,
      });
      return response.data.code;
    } catch (error) {
      console.error('Error generating access code:', error);
      throw new Error('Access code generation failed');
    }
  }
}
export class AppService {}
