import { Injectable, HttpStatus, BadRequestException } from '@nestjs/common';
import * as wifi from 'node-wifi';
import { exec, execSync } from 'child_process';
import { platform, networkInterfaces } from 'os';
import { Response } from 'express';

@Injectable()
export class NetworkService {
  constructor() {
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
      exec('sudo nmcli device wifi rescan');
    } catch (error) {}
    console.log('in');
    const result = await wifi
      .scan()
      .then((networks: { ssid: string; signal_level: number }[]) => {
        return networks;
      })
      .catch((error: any) => {
        throw new BadRequestException(error.message, {
          cause: new Error(),
        });
      });
    return result;
  }

  async getStatus() {
    try {
      const interfaceDetails = await networkInterfaces();
      const wlan0_ip = interfaceDetails['wlan0'][0].address;
      // const wlan0_ssid = execSync(
      //   'nmcli -t -f name,device connection show --active | grep wlan0 | cut -d: -f1',
      // ).toString();
      // const eth0_ssid = execSync(
      //   'nmcli -t -f name,device connection show --active | grep eth0 | cut -d: -f1',
      // ).toString();
      const eth0_ip = interfaceDetails['eth0']
        ? interfaceDetails['eth0'][0].address
        : '--';
      console.log(wlan0_ip, eth0_ip);

      return {
        wifi: wlan0_ip,
        ethernet: eth0_ip,
      };
    } catch (error) {
      throw new BadRequestException(error.message, {
        cause: new Error(),
      });
    }
  }

  async connectToWifi(response: Response, connectToWifi: any) {
    let result = '';
    console.log('connectToWifi', connectToWifi);
    if (platform() === 'linux') {
      try {
        if (connectToWifi.isDhcp) {
          try {
            execSync(`sudo nmcli con delete "Wifi connection"`);
          } catch (error) {}
          result = execSync(
            `sudo nmcli dev wifi connect ${connectToWifi.ssid}  name "Wifi connection" password ${connectToWifi.password}`,
          ).toString();
          if (result.includes('Error'))
            return response.status(HttpStatus.BAD_REQUEST).send();
          else
            return response
              .status(HttpStatus.CREATED)
              .send('connection succes');
        } else {
          try {
            execSync(`sudo nmcli con delete "Wifi connection"`);
          } catch (error) {}
          result = execSync(
            `sudo nmcli con add type wifi ifname wlan0 con-name "Wifi connection" ssid  ${
              connectToWifi.ssid
            }  -- wifi-sec.key-mgmt wpa-psk wifi-sec.psk ${
              connectToWifi.password
            } ipv4.method manual ipv4.address ${connectToWifi.ip}/${
              connectToWifi.mask
            } ipv4.dns ${connectToWifi.dnsP}${
              connectToWifi.dnsS ? ',' + connectToWifi.dnsS : ''
            } ipv4.gateway ${
              connectToWifi.gw
            }  && sudo nmcli con up "Wifi connection"`,
          ).toString();
          if (result.includes('Error'))
            return response.status(HttpStatus.BAD_REQUEST).send();
          else
            return response
              .status(HttpStatus.CREATED)
              .send('connection succes');
        }
      } catch (error) {
        return response.status(HttpStatus.BAD_REQUEST).send(error.message);
      }
    }
    if (platform() === 'win32') {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .send('not working on windows');
    }
  }

  async connectToEthernet(response: Response, connectToEthernet: any) {
    let result = '';
    if (platform() === 'linux') {
      try {
        if (connectToEthernet.isDhcp) {
          try {
            execSync(`sudo nmcli con delete "Wired connection"`);
          } catch (error) {}
          result = execSync(
            `sudo nmcli con add type ethernet con-name "Wired connection" ifname eth0 &&  sudo nmcli con up Wired\\ connection`,
          ).toString();
          if (result.includes('Error'))
            return response.status(HttpStatus.BAD_REQUEST).send();
          else
            return response
              .status(HttpStatus.CREATED)
              .send('connection succes');
        } else {
          result = execSync(
            `sudo nmcli con add type ethernet con-name "Wired connection" ifname eth0 ip4 ${
              connectToEthernet.ip
            }/${connectToEthernet.mask} gw4 ${connectToEthernet.gw} ipv4.dns ${
              connectToEthernet.dnsP
            }${
              connectToEthernet.dnsS ? ',' + connectToEthernet.dnsS : ''
            }   &&  sudo nmcli con up Wired\\ connection`,
          ).toString();
        }
        if (result.includes('Error'))
          return response.status(HttpStatus.BAD_REQUEST).send();
        else
          return response.status(HttpStatus.CREATED).send('connection succes');
      } catch (error) {
        return response.status(HttpStatus.BAD_REQUEST).send(error.message);
      }
    }
    if (platform() === 'win32') {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .send('not working on windows');
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
