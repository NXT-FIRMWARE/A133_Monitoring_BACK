import { Module, forwardRef } from '@nestjs/common';
import { SocketService } from './socket.service';
import { NetworkModule } from 'src/network/network.module';
import { SerialStramModule } from 'src/serial-stram/serial-stram.module';
import { PerformanceModule } from 'src/performance/performance.module';
import { ExecuteCommandModule } from 'src/execute-command/execute-command.module';

@Module({
  imports: [
    forwardRef(() => NetworkModule),
    forwardRef(() => SerialStramModule),
    forwardRef(() => PerformanceModule),
    forwardRef(() => ExecuteCommandModule),
  ],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}
