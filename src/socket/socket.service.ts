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

  onCommunication(serialPortData: any) {
    console.log('data', serialPortData)
    if (serialPortData.action === 'open') {
      try {   
        this.communication.openPort(serialPortData.path, serialPortData.baudRate, serialPortData.delimiter);
      } catch (error) {
        console.log(error.message)
      } 
    }
    if (serialPortData.action === 'close') {
      this.communication.ClosePort(serialPortData.path);
    }
    if (serialPortData.action === 'write') {
      this.communication.writePort(serialPortData.path, serialPortData.data);
    }
  }

  send(topic: string, data: any) {
    this.io.emit(topic, data);
  }
}
