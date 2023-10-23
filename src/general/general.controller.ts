import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { GeneralService } from './general.service';
import { Response } from 'express';

@Controller('general')
export class GeneralController {
  constructor(private readonly generalService: GeneralService) {}

  @Get('hostname')
  async getHostname() {
    return this.generalService.getHostname();
  }

  @Post('hostname')
  setHostname(@Res() response: Response, @Body() hostname: any) {
    console.log(hostname, typeof hostname);
    return this.generalService.setHostname(response, hostname.hostname);
  }
}
