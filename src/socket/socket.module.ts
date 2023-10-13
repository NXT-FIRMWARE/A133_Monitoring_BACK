import { Module, forwardRef } from '@nestjs/common';
import { SocketService } from './socket.service';
import { NetworkModule } from 'src/network/network.module';
import { SerialModule } from 'src/serial/serial.module';
import { PerformanceModule } from 'src/performance/performance.module';
import { ShellModule } from 'src/shell/shell.module';

@Module({
  imports: [
    forwardRef(() => NetworkModule),
    forwardRef(() => SerialModule),
    forwardRef(() => PerformanceModule),
    forwardRef(() => ShellModule),
  ],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}
