import { Module, forwardRef } from '@nestjs/common';
import { SocketService } from './socket.service';
import { DatabaseModule } from 'src/database/database.module';
import { CameraModule } from 'src/camera/camera.module';

@Module({
  imports: [forwardRef(() => DatabaseModule), forwardRef(() => CameraModule)],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}
