import { Controller, Get } from '@nestjs/common';
import { networkInterfaces } from 'os';

@Controller('network')
export class NetworkController {
  @Get('mac')
  async getMac() {
    try {
      const interfaceDetails = await networkInterfaces();
      const wlan0_mac = interfaceDetails['wlan0'][0].address;
      return wlan0_mac;
    } catch (error) {
      return error.message;
    }
  }
}
