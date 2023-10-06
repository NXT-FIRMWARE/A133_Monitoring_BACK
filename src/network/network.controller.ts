import { Body, Controller, Get, Post } from '@nestjs/common';
import { NetworkService } from './network.service';

@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('connect')
  async connectToNewWifi(@Body() connectWifi: any) {
    return await this.networkService.connectToWifi(connectWifi);
  }
  @Get('disconnect')
  async disconnect() {
    return await this.networkService.disconnect();
  }
}
