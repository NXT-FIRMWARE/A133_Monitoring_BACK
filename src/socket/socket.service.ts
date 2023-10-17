import { Inject, Injectable, OnModuleInit, forwardRef } from '@nestjs/common';
import { Server } from 'socket.io';
import { CameraService } from 'src/camera/camera.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SocketService implements OnModuleInit {
  constructor(
    @Inject(forwardRef(() => DatabaseService))
    private database: DatabaseService,
    @Inject(forwardRef(() => CameraService))
    private camera: CameraService,
  ) {
    console.log('socket init');
  }
  private io: Server;

  onModuleInit() {
    this.io = new Server({
      cors: {
        origin: '*',
      },
    });
    this.io.listen(3001, {
      cors: { origin: '*' },
    });
    this.io.on('connection', this.onConnect.bind(this));
  }

  onConnect(socket: any) {
    console.log('new Socket Client Connected!', socket.id);
    socket.on('disconnect', () =>
      console.log('client disconnected', socket.id),
    );
    socket.on('data', this.onData.bind(this));
    socket.on('camera', this.onCamera.bind(this));
  }
  onData(data: any) {
    console.log(data.topic, data.value);
    if (data.topic === 'test') {
      console.log('test');
    }
  }

  onCamera(data: any) {
    console.log(data.topic, data.value);
    if (data.topic === 'addCamera') {
      this.database.create(data.value);
    }
    if (data.topic === 'updateCamera') {
      this.database.update(data.value);
    }
    if (data.topic === 'deleteCamera') {
      this.database.delete(data.value);
    }
    if (data.topic === 'startCapture') {
      this.camera.captureProcess();
    }
  }
  send(topic: string, data: any) {
    this.io.emit(topic, data);
  }
}
