import { Module, forwardRef } from '@nestjs/common';
import { SocketService } from './socket.service';
import { NetworkModule } from 'src/network/network.module';
import { SerialModule } from 'src/serial/serial.module';
import { PerformanceModule } from 'src/performance/performance.module';
import { ExecuteCommandModule } from 'src/execute-command/execute-command.module';

@Module({
  imports: [
    forwardRef(() => NetworkModule),
    forwardRef(() => SerialModule),
    forwardRef(() => PerformanceModule),
    forwardRef(() => ExecuteCommandModule),
  ],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}
