import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { Manager } from './manager.entity';

@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post('register')
  async register(@Body() body: any) {
    try {
      const newManager = await this.managerService.registerHotel(body);
      return {
        success: true,
        message: 'Hotel registrato con successo!',
        managerId: newManager.id,
      };
    } catch (error) {
      console.error('Error registering hotel:', error);
      return { success: false, message: 'Errore nella registrazione dell\'hotel' };
    }
  }

  @Get('settings/:id')
  async getSettings(@Param('id') id: number): Promise<Manager> {
    const manager = await this.managerService.getManager(id);
    if (manager) {
      return manager;
    }
    throw new Error('Manager non trovato');
  }

  @Post('settings/:id')
  async updateSettings(@Param('id') id: number, @Body() data: any) {
    try {
      const updatedManager = await this.managerService.updateSettings(id, data);
      return {
        success: true,
        message: 'Impostazioni aggiornate con successo',
        managerId: updatedManager.id,
      };
    } catch (error) {
      console.error('Error updating settings:', error);
      return { success: false, message: 'Errore nell\'aggiornamento delle impostazioni' };
    }
  }
}
