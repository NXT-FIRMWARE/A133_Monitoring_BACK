import { Inject, Injectable, OnModuleInit, forwardRef } from '@nestjs/common';
import { Server } from 'socket.io';
import { CommunicationService } from 'src/communication/communication.service';

@Injectable()
export class SocketService implements OnModuleInit {
  constructor(
    @Inject(forwardRef(() => CommunicationService))
    private communication: CommunicationService,
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
    socket.on('communication', this.onCommunication.bind(this));
  }

  onCommunication(data: any) {
    console.log(data.topic, data.value);
    if (data.topic === 'open') {
      this.communication.openUsbPort(data.value);
    }
    if (data.topic === 'close') {
      this.communication.CloseUsbPort(data.value);
    }
  }

  send(topic: string, data: any) {
    this.io.emit(topic, data);
  }
}
