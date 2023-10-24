import { Body, Controller, Get, Post } from '@nestjs/common';
import { PerformanceService } from './performance.service';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performance: PerformanceService) {}

  @Get('status')
  getStatus() {
    return this.performance.getPerformance();
  }

  @Get('services')
  async getService() {
    return await this.performance.services();
  }

  @Post('process')
  async killProcess(@Body() pid: number) {
    return await this.performance.killProcess(pid);
  }
}
