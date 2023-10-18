import { Module, forwardRef } from '@nestjs/common';
import { CameraService } from './camera.service';
import { SocketModule } from 'src/socket/socket.module';
import { HttpPosterModule } from 'src/http-poster/http-poster.module';

@Module({
  imports: [forwardRef(() => SocketModule), HttpPosterModule],
  providers: [CameraService],
  exports: [CameraService],
})
export class CameraModule {}
