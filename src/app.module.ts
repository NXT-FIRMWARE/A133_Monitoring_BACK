import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PerformanceModule } from './performance/performance.module';
import { NetworkModule } from './network/network.module';
import { SerialModule } from './serial/serial.module';
import { ShellModule } from './shell/shell.module';

@Module({
  imports: [PerformanceModule, NetworkModule, SerialModule, ShellModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
