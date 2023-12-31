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
  connectEthernet(@Res() response: Response, @Body() connectToEthernet: any) {
    return this.networkService.connectToEthernet(response, connectToEthernet);
  }
  @Post('mobile')
  setMobile(@Res() response: Response, @Body() connectToMobile: any) {
    return this.networkService.setMobile(response, connectToMobile);
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
