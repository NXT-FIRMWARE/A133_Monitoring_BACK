import { Module } from '@nestjs/common';
import { SerialStramService } from './serial-stram.service';
import { SerialStramController } from './serial-stram.controller';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [SocketModule],
  controllers: [SerialStramController],
  providers: [SerialStramService],
})
export class SerialStramModule {}
