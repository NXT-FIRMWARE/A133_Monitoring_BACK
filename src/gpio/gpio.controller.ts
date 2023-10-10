import { Controller, Post, Body } from '@nestjs/common';

import { GpioService } from './gpio.service';
@Controller('gpio')
export class GpioController {
  constructor(private readonly gpioService: GpioService) { }
  //test code 
  // {
  //   "status": 0,
  //   "gpio": "GPIOPD21"
  // }
  @Post('execute')
  async executeCommand(@Body() requestBody: any): Promise<{ status: string }> {
    const { status, gpio } = requestBody;
    console.log("hello")
    try {
      const result = await this.gpioService.executeGpioCommand(status, gpio);
      return { status: result };
    } catch (error) {

      console.error('Error:', error.message);
      throw new Error('Failed to execute GPIO command');
    }
  }
}
