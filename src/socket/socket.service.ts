import { Inject, Injectable, OnModuleInit, forwardRef } from '@nestjs/common';
import { Server } from 'socket.io';
import { NetworkService } from 'src/network/network.service';

@Injectable()
export class SocketService implements OnModuleInit {
  constructor(
    @Inject(forwardRef(() => NetworkService))
    private network: NetworkService,
  ) {}
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
    socket.on('message', this.onMessage.bind(this));
  }

  onMessage(data: any) {
    console.log(data.topic, data.value);
    if (data.topic === 'connect') {
      this.network.connectToWifi(data.value);
    }
  }

  send(topic: string, data: any) {
    this.io.emit(topic, data);
  }
}
