import { Module } from '@nestjs/common';
import { SocketModule } from './socket/socket.module';
import { CameraModule } from './camera/camera.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [SocketModule, CameraModule, DatabaseModule],
})
export class AppModule {}
