import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SocketService } from 'src/socket/socket.service';
import { SerialPort } from 'serialport';

@Injectable()
export class SerialStramService {
  constructor(private socket: SocketService) {}
  @Cron(CronExpression.EVERY_5_SECONDS)
  async listPort() {
    const list = await SerialPort.list().then((ports) =>
      ports.map((port) => port['friendlyName']),
    );
    // console.log('list', list);
    this.socket.send('ports', list);
  }
}
