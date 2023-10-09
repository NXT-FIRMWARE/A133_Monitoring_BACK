import { Inject, Injectable, forwardRef } from '@nestjs/common';
import * as wifi from 'node-wifi';
import { SocketService } from 'src/socket/socket.service';
import { execSync } from 'child_process';
import { platform } from 'os';

@Injectable()
export class NetworkService {
  constructor(
    @Inject(forwardRef(() => SocketService))
    private socket: SocketService,
  ) {
    console.log('network init');
    this.bootstrap();
  }
  bootstrap() {
    wifi.init({
      iface: null, // network interface, choose a random wifi interface if set to null
    });
  }

  async getWifiList() {
    try {
      try {
        execSync('sudo nmcli dev wifi rescan');
      } catch (err) {}
      await wifi.scan((error: any, networks: any) => {
        if (error) {
          console.log(error);
        } else {
          const wifi_list = networks.map((network: any) => ({
            ssid: network.ssid,
            mac: network.mac,
            security: network.security,
            frequency: network.frequency / 1000,
            quality: network.quality,
          }));
          this.socket.send('wifi_List', wifi_list);
        }
      });
    } catch (error) {
      console.error('Error getting wifi list data:', error);
      throw error;
    }
  }

  async getStatus() {
    try {
      await wifi.getCurrentConnections(
        (error: any, currentConnections: any) => {
          if (error) {
            console.log(error);
          } else {
            // console.log(currentConnections[0]);
            this.socket.send('current_Connection', {
              ssid: currentConnections[0].ssid,
              mac: currentConnections[0].mac,
              security: currentConnections[0].security,
              quality: currentConnections[0].quality,
            });
          }
        },
      );
    } catch (error) {
      console.error('Error getting current Wifi Connection data:', error);
      this.socket.send('current_Connection', error.toString());
    }
  }

  async connectToWifi(connectToWifi: any) {
    let result = '';
    console.log('in connect');
    if (platform() === 'linux') {
      try {
        result = execSync(
          `sudo nmcli dev wifi connect ${connectToWifi.ssid} password ${connectToWifi.password}`,
        ).toString();
        console.log('the reult is :', result);
        if (result.toString().includes('Error'))
          this.socket.send('Connection_status', 'wrong Password');
        else {
          this.socket.send(
            'Connection_status',
            `linux connected successefull to ${connectToWifi.ssid}`,
          );
        }
      } catch (error) {
      this.socket.send(
          'Connection_status',
          'SSID not found or password Wrong',
        );
}
    }
    if (platform() === 'win32') {
      console.log('windows');
      this.socket.send('connectx', 'not working on windows');
    }
  }

  async disconnect() {
    wifi.disconnect((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Disconnected');
      }
    });
  }
}
