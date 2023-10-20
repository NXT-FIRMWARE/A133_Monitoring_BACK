import { Body, Controller, Get, Post } from '@nestjs/common';
import { NetworkService } from './network.service';

@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('wifi')
  connectWifi(@Body() connectToWifi: any) {
    return this.networkService.connectToWifi(connectToWifi);
  }
  @Post('ethernet')
  connectEthernet(@Body() connectToEthernet: any) {
    return this.networkService.connectToWifi(connectToEthernet);
  }

  @Get('status')
  getStatus() {
    return this.networkService.getStatus();
  }

  @Get('scan')
  async getScan() {
    return await this.networkService.getWifiList();
  }
}
