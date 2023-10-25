import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { SocketService } from 'src/socket/socket.service';
import { DelimiterParser, SerialPort } from 'serialport';




interface Port {
  serialport: any;
  path: string;
}

@Injectable()
export class CommunicationService {
  constructor(
    @Inject(forwardRef(() => SocketService))
    private socket: SocketService,
  ) {}
   private openPorts : Port []= [] 
  async openPort(path , baudRate, delimiter) {
    const port = new SerialPort({
      path: path,
      baudRate: baudRate,
      autoOpen: false,
    });
    this.openPorts.push( {
      serialport: port,
      path: path
    })
   try {
    port.open(function (err) {
      if (err) {
        console.log('Error opening port: ', err.message);
        return err.message;
      } else {
        console.log('port opened');
        return 'port Opened';
      }
    });
    port.addListener('close', () => {
      this.ClosePort(port.path);
    });
    port.addListener('error', () => {
      console.log('error')
    });
    // 
  const delimi = delimiter.replace(/\\r/g, '\r').replace(/\\n/g, '\n')
    // const parser = port.pipe(new RegexParser({ regex: /[\r\n]+/ }));
    const parser = port.pipe(new DelimiterParser({ delimiter: delimi }))
    parser.on('ready', () =>
      console.log('the ready byte sequence has been received'),
    );
    parser.on('data', (data) => {
      console.log('data', data.toString());
      this.socket.send("port", {data :data.toString()});
    });
   } catch (error) {
    console.log(error.message)
   }
  }

  async ClosePort(serialPortPath) {
    try {
      const portToClose = this.openPorts.filter(port => port.path === serialPortPath)
      if(portToClose.length !== 0 ){
      portToClose[0].serialport.close();
      this.openPorts = this.openPorts.filter(port => port.path !== portToClose[0].path);
      console.log('ports', this.openPorts);
      }
      } catch (error) {
        console.log(error.message)
      }
  }

  async writePort(serialPortPath, data) {
    try {
      const portToWrite = this.openPorts.filter(port => port.path === serialPortPath)
      if(portToWrite.length !== 0 ){
        portToWrite[0].serialport.write(data, function(err) {
        if (err) {
          this.socket.send('error', err.message)
        }
        console.log('message written')
      })
    } 
  }catch (error) {
    console.log(error.message)
  }
}

  async getSerialList() {
    let list = await SerialPort.list().then((ports) =>
      ports.map((port) => ({
        path:port.path,
        manufacturer: port.manufacturer ? port.manufacturer : "--",
        vendorId: port.vendorId ? port.vendorId : "--",
        productId: port.productId ? port.productId : "--"
      })
      ),   
    );
    list = list.filter((port) => port.path != '/dev/ttyS0');
    return list;
  }
}
