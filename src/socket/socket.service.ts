import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService implements OnModuleInit {
  constructor() {}
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
  }

  onData(data: any) {
    console.log(data.topic, data.value);
    if (data.topic === 'test') {
      console.log(data.topic, data.value);
    }
  }
  send(topic: string, data: any) {
    this.io.emit(topic, data);
  }
}
