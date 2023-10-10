import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PerformanceModule } from './performance/performance.module';
import { NetworkModule } from './network/network.module';
import { SerialStramModule } from './serial-stram/serial-stram.module';
import { GpioModule } from './gpio/gpio.module';
import { BluetoothModule } from './bluetooth/bluetooth.module';

@Module({
  imports: [ScheduleModule.forRoot(),
    PerformanceModule,
    NetworkModule,
    SerialStramModule,
    GpioModule,
    // BluetoothModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
