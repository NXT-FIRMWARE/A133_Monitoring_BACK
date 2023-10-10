import { Module } from '@nestjs/common';
import { GpioController } from './gpio.controller';
import { GpioService } from './gpio.service';

@Module({
  controllers: [GpioController],
  providers: [GpioService]
})
export class GpioModule {}
