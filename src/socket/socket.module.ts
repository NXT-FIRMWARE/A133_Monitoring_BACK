import { Module, forwardRef } from '@nestjs/common';
import { SocketService } from './socket.service';
import { NetworkModule } from 'src/network/network.module';
import { SerialStramModule } from 'src/serial-stram/serial-stram.module';

@Module({
  imports: [
    forwardRef(() => NetworkModule),
    forwardRef(() => SerialStramModule),
  ],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}
