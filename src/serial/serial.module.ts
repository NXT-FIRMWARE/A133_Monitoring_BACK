import { Module, forwardRef } from '@nestjs/common';
import { SerialService } from './serial.service';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [forwardRef(() => SocketModule)],
  providers: [SerialService],
  exports: [SerialService],
})
export class SerialModule {}
