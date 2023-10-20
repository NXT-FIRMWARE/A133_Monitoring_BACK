import { Module, forwardRef } from '@nestjs/common';
import { NetworkService } from './network.service';
import { SocketModule } from 'src/socket/socket.module';
import { NetworkController } from './network.controller';

@Module({
  imports: [forwardRef(() => SocketModule)],
  providers: [NetworkService],
  exports: [NetworkService],
  controllers: [NetworkController],
})
export class NetworkModule {}