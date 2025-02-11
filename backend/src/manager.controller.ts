import { Controller, Get, Post, Param, Body, NotFoundException } from '@nestjs/common';
import { ManagerService } from './manager.service';

@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  // Endpoint per ottenere un manager
  @Get(':id')
  async getManager(@Param('id') id: number) {
    const manager = await this.managerService.getManager(id);
    if (!manager) {
      throw new NotFoundException(`Manager con id ${id} non trovato.`);
    }
    return manager;
  }

  // Endpoint per creare un manager
  @Post()
  async createManager(@Body() data: any) {
    return this.managerService.createManager(data);  // Usa il metodo createManager del servizio
  }
}
