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

  @Get('status')
  getStatus(@Res() response: Response) {
    return this.networkService.getStatus(response);
  }

  @Get('scan')
  async getScan(@Res() response: Response) {
    return await this.networkService.getWifiList(response);
  }
}
