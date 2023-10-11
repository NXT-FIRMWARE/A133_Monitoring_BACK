import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PerformanceModule } from './performance/performance.module';
import { NetworkModule } from './network/network.module';
import { SerialStramModule } from './serial-stram/serial-stram.module';
import { SshModule } from './ssh/ssh.module';

@Module({
  imports: [PerformanceModule, NetworkModule, SerialStramModule, SshModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
