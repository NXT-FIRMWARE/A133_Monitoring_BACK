import {Controller, Get} from '@nestjs/common';
import { PerformanceService } from './performance.service';



@Controller('performance')
export class PerformanceController {
  constructor(private readonly performance: PerformanceService) {}

  @Get('status')
  getStatus() {
    return this.performance.getPerformance();
  }
}
