import { Module, forwardRef } from '@nestjs/common';
import { NetworkService } from './network.service';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [forwardRef(() => SocketModule)],
  providers: [NetworkService],
  exports: [NetworkService],
})
export class NetworkModule {}