import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import * as wifi from 'node-wifi';
import { SocketService } from 'src/socket/socket.service';
import { exec, execSync } from 'child_process';
import { platform, networkInterfaces } from 'os';
import { error } from 'console';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NetworkService {
  private ssidList: any[];
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

  // getWifiList() {
  //   return this.ssidList;
  // }
  // @Cron(CronExpression.EVERY_5_SECONDS)
  // async scanWifi() {
  //   try {
  //     /***********/
  //     try {
  //       execSync('sudo nmcli dev wifi rescan');
  //     } catch (err) {}

  //     /***********/
  //     return await wifi.scan((error: any, networks: any) => {
  //       if (error) {
  //         console.log(error);
  //       } else {
  //         console.log(networks);
  //         this.ssidList = networks;
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error getting wifi list data:', error);
  //     this.ssidList = [];
  //   }
  // }
  async getWifiList() {
    try {
      exec('sudo nmcli device wifi rescan');
    } catch (error) {}

    const result = await wifi
      .scan()
      .then((networks: { ssid: string; signal_level: number }[]) => {
        return networks;
      })
      .catch((error: any) => {
        return error;
      });
    return result;
  }

  async hostname(hostname) {
    console.log('hostname', hostname);
    try {
      const result = execSync(
        `sudo hostnamectl set-hostname ${hostname}`,
      ).toString();
      return result;
    } catch (error) {
      return error.message;
    }
  }

  async getStatus() {
    try {
      const interfaceDetails = await networkInterfaces();
      const wlan0Ip = interfaceDetails['wlan0'][0].address;
      const eth0Ip = interfaceDetails['eth0']
        ? interfaceDetails['eth0'][0].address
        : '--';
      console.log(wlan0Ip, eth0Ip);
      return {
        wifi: wlan0Ip,
        ethernet: eth0Ip,
      };
    } catch (error) {
      console.error('Error getting current Wifi Connection data:', error);
      return error;
    }
  }

  async connectToWifi(connectToWifi: any) {
    let result = '';
    console.log('connectToWifi', connectToWifi);
    if (platform() === 'linux') {
      try {
        if (connectToWifi.isDhcp) {
          result = execSync(
            `sudo nmcli dev wifi connect ${connectToWifi.ssid} password ${connectToWifi.password}`,
          ).toString();
          console.log('the reult is :', result);
          if (result.toString().includes('Error')) {
            console.log('error');
            throw new BadRequestException('wrong password', {
              cause: new Error(),
              description: 'wrong password',
            });
          } else return `linux connected successefull to ${connectToWifi.ssid}`;
        } else {
          try {
            execSync('sudo nmcli con delete wifi-wlan0 ');
          } catch (error) {}
          result = execSync(
            `sudo nmcli con add type wifi ifname wlan0 ssid  ${connectToWifi.ssid}  -- wifi-sec.key-mgmt wpa-psk wifi-sec.psk ${connectToWifi.password} ipv4.method manual ipv4.address ${connectToWifi.ip}/${connectToWifi.mask} ipv4.dns ${connectToWifi.dns} ipv4.gateway ${connectToWifi.gw}  && sudo nmcli con up wifi-wlan0 `,
          ).toString();
          if (result.toString().includes('Error')) return error;
          else return `linux connected successefull to ${connectToWifi.ssid}`;
        }
      } catch (error) {
        console.log('error');
        throw new BadRequestException('wrong password', {
          cause: new Error(),
          description: 'wrong password',
        });
      }
    }
    if (platform() === 'win32') {
      console.log('windows');
      return 'not working on windows';
    }
  }

  async connectToEthernet(connectToEthernet: any) {
    let result = '';
    if (platform() === 'linux') {
      try {
        if (connectToEthernet.isDhcp) {
          const is_interface_exist = execSync(
            'ls /etc/NetworkManager/system-connections/',
          ).toString();
          if (is_interface_exist.includes('Wired connection'))
            result = execSync(
              'sudo nmcli connection modify Wired\\ connection ipv4.method auto',
            ).toString();
          else
            result = execSync(
              `sudo nmcli con add type ethernet con-name "Wired connection" ifname eth0 &&  sudo nmcli con up Wired\\ connection`,
            ).toString();
          console.log('the reult is :', result);
          return result;
        } else {
          try {
            execSync('sudo nmcli con delete Wired\\ connection');
          } catch (error) {}
          result = execSync(
            `sudo nmcli con add type ethernet con-name "Wired connection" ifname eth0 ip4 ${connectToEthernet.ip}/${connectToEthernet.mask} gw4 ${connectToEthernet.dw} ipv4.dns ${connectToEthernet.dnsP} &&  sudo nmcli con up Wired\\ connection`,
          ).toString();
        }
        if (result.includes('Error')) return result;
        else {
          return `linux connected successefull to ethernet`;
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    }
    if (platform() === 'win32') {
      console.log('windows');
      return 'not working on windows';
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
