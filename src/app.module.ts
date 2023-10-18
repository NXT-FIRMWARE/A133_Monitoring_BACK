import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { NetworkModule } from './network/network.module';

@Module({
  imports: [SocketModule, NetworkModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
