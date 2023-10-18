import { Module, forwardRef } from '@nestjs/common';
import { SocketService } from './socket.service';
import { NetworkModule } from 'src/network/network.module';

@Module({
  imports: [forwardRef(() => NetworkModule)],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}
