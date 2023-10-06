import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { SocketService } from 'src/socket/socket.service';
import { SerialPort } from 'serialport';
import { RegexParser } from '@serialport/parser-regex';
@Injectable()
export class SerialStramService {
  constructor(
    @Inject(forwardRef(() => SocketService))
    private socket: SocketService,
  ) {}
  private port: SerialPort;

  async listPort() {
    const list = await SerialPort.list().then((ports) =>
      ports.map((port) => ({
        portName: port['friendlyName'],
        path: port.path,
      })),
    );
    console.log('list', list);
    this.socket.send('ports', list);
  }

  async openUsbPort(data: any) {
    this.port = new SerialPort({
      path: data.path,
      baudRate: data.baudRate,
      autoOpen: false,
    });
    this.port.open(function (err) {
      if (err) {
        console.log('Error opening port: ', err.message);
        return err.message;
      } else {
        console.log('port opened');
        return 'port Opened';
      }
    });
    this.port.addListener('close', () => {
      this.CloseUsbPort();
    });
    const parser = this.port.pipe(new RegexParser({ regex: /[\r\n]+/ }));
    parser.on('ready', () =>
      console.log('the ready byte sequence has been received'),
    );
    parser.on('data', (data) => {
      console.log('data', data.toString());
      this.socket.send('usbData', data.toString());
    });
  }

  async CloseUsbPort() {
    // this.socket.send('usbData', 'portClosed');
    console.log('port Closed');
    if (this.port !== undefined && this.port.isOpen) this.port.close();
  }
}
