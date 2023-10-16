import { Module, forwardRef } from '@nestjs/common';
import { CameraService } from './camera.service';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [forwardRef(() => SocketModule)],
  providers: [CameraService],
  exports: [CameraService],
})
export class CameraModule {}
