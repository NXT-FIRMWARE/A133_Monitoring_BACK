import { Inject, Injectable, OnModuleInit, forwardRef } from '@nestjs/common';
import { Server } from 'socket.io';
import { NetworkService } from 'src/network/network.service';
import { PerformanceService } from 'src/performance/performance.service';
import { SerialStramService } from 'src/serial-stram/serial-stram.service';
import { SshService } from 'src/ssh/ssh.service';

@Injectable()
export class SocketService implements OnModuleInit {
  constructor(
    @Inject(forwardRef(() => NetworkService))
    private network: NetworkService,
    @Inject(forwardRef(() => SerialStramService))
    private serialUsb: SerialStramService,
    @Inject(forwardRef(() => PerformanceService))
    private performance: PerformanceService,
    @Inject(forwardRef(() => SshService))
    private ssh: SshService,
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
    socket.on('network', this.onNetwork.bind(this));
    socket.on('performance', this.onPerformance.bind(this));
    socket.on('communication', this.onCommunication.bind(this));
    socket.on('ssh', this.onSsh.bind(this));
  }

  onNetwork(data: any) {
    console.log(data.topic, data.value);
    if (data.topic === 'connectTo') {
      this.network.connectToWifi(data.value);
    }
    if (data.topic === 'scan') {
      this.network.getWifiList();
    }
    if (data.topic === 'current_Connection') {
      this.network.getStatus();
    }
  }

  onSsh(data: any) {
    console.log(data.topic, data.value);
    if (data.topic === 'executeCommand') {
      this.ssh.executeCommand(data.value);
    }
  }

  onPerformance(data: any) {
    console.log(data.topic, data.value);
    if (data.topic === 'battery') {
      this.performance.getBatteryUsage();
    }
    if (data.topic === 'cpu') {
      this.performance.getCpuUsage();
    }
    if (data.topic == 'memory') {
      this.performance.getMemoryUsage();
    }
    if (data.topic == 'storage') {
      this.performance.getDiskUsage();
    }
  }
  onCommunication(data: any) {
    console.log(data.topic, data.value);
    if (data.topic === 'open') {
      this.serialUsb.openUsbPort(data.value);
    }
    if (data.topic === 'close') {
      this.serialUsb.CloseUsbPort();
    }
    if (data.topic == 'list') {
      this.serialUsb.listPort();
    }
  }

  send(topic: string, data: any) {
    this.io.emit(topic, data);
  }
}
