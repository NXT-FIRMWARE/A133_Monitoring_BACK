import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { NetworkService } from './network.service';
import { Response } from 'express';
@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('wifi')
  connectWifi(@Res() response: Response, @Body() connectToWifi: any) {
    return this.networkService.connectToWifi(response, connectToWifi);
  }
  @Post('ethernet')
  connectEthernet(@Body() connectToEthernet: any) {
    return this.networkService.connectToEthernet(connectToEthernet);
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
