import { Module, forwardRef } from '@nestjs/common';
import { SocketService } from './socket.service';
import { CommunicationModule } from 'src/communication/communication.module';

@Module({
  imports: [forwardRef(() => CommunicationModule)],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}
