import { Module, forwardRef } from '@nestjs/common';
import { SerialService } from './serial.service';
import { SerialController } from './serial.controller';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [forwardRef(() => SocketModule)],
  controllers: [SerialController],
  providers: [SerialService],
  exports: [SerialService],
})
export class SerialModule {}
