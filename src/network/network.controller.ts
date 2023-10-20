import { Body, Controller, Get, Post } from '@nestjs/common';
import { NetworkService } from './network.service';

@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('Connect_Wifi')
  connectWifi(@Body() connectToWifi: any) {
    return this.networkService.connectToWifi(connectToWifi);
  }
  @Post('Connect_Ethernet')
  connectEthernet(@Body() connectToEthernet: any) {
    return this.networkService.connectToWifi(connectToEthernet);
  }

  @Get('status')
  getStatus() {
    return this.networkService.getStatus();
  }

  @Get('scan')
  async getScan() {
    console.log('controller scan');
    const list = await this.networkService.getWifiList();
    console.log('list', list);
    return list;
  }
}
