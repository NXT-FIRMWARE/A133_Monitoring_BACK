import { Controller, Get } from '@nestjs/common';
import { CommunicationService } from './communication.service';

@Controller('communication')
export class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  @Get('list')
  async getSerialList() {
    const serialList = await this.communicationService.getSerialList();
    return serialList;
  }
}
