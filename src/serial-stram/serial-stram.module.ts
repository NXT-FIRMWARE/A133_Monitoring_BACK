import { Module, forwardRef } from '@nestjs/common';
import { SerialStramService } from './serial-stram.service';
import { SerialStramController } from './serial-stram.controller';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [forwardRef(() => SocketModule)],
  controllers: [SerialStramController],
  providers: [SerialStramService],
  exports: [SerialStramService],
})
export class SerialStramModule {}
