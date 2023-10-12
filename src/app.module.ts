import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PerformanceModule } from './performance/performance.module';
import { NetworkModule } from './network/network.module';
import { SerialStramModule } from './serial-stram/serial-stram.module';
import { ExecuteCommandModule } from './execute-command/execute-command.module';

@Module({
  imports: [
    PerformanceModule,
    NetworkModule,
    SerialStramModule,
    ExecuteCommandModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
