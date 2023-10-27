import { Body, Controller, Get, Post } from '@nestjs/common';
import { PerformanceService } from './performance.service';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performance: PerformanceService) {}

  @Get('status')
  getStatus() {
    return this.performance.getPerformance();
  }

  @Get('processes')
  async getService() {
    return await this.performance.processes();
  }

  @Post('process')
  async killProcess(@Body() data: any) {
    return await this.performance.killProcess(data.pid);
  }
}
