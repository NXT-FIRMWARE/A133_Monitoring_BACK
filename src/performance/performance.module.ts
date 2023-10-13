import { Module, forwardRef } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [forwardRef(() => SocketModule)],
  providers: [PerformanceService],
  exports: [PerformanceService],
})
export class PerformanceModule {}
