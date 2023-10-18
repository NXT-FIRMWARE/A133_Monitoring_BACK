import { Module } from '@nestjs/common';
import { SocketModule } from './socket/socket.module';
import { CameraModule } from './camera/camera.module';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpPosterModule } from './http-poster/http-poster.module';

@Module({
  imports: [
    SocketModule,
    CameraModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    HttpPosterModule,
  ],
})
export class AppModule {}
