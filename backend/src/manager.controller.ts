// src/manager.controller.ts
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { Manager } from './manager.entity';

@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  // Rotta per ottenere il Manager
  @Get(':id')
  async getSettings(@Param('id') id: number): Promise<Manager> {
    return this.managerService.getManager(id);
  }

  // Rotta per creare un nuovo Manager
  @Post()
  async createSettings(@Body() data: Partial<Manager>): Promise<Manager> {
    return this.managerService.createManager(data);
  }
}
