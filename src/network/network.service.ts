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
        const fitered_wifi = networks.filter((wifi, index) => {
          return (
            index ===
            networks.findIndex((element) => wifi.ssid === element.ssid)
          );
        });
        return fitered_wifi;
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
      const eth0_ip = interfaceDetails['eth0']
        ? interfaceDetails['eth0'][0].address
        : '--';
      const mobile_ip = interfaceDetails['ppp0']
        ? interfaceDetails['ppp0'][0].address
        : '--';
      console.log(wlan0_ip, eth0_ip);

      return {
        wifi: wlan0_ip,
        ethernet: eth0_ip,
        mobile: mobile_ip,
      };
    } catch (error) {
      throw new BadRequestException(error.message, {
        cause: new Error(),
      });
    }
  }

  async setMobile(response: Response, connectToMobile: any) {
    try {
      if (connectToMobile.pin)
        execSync(`sudo mmcli -i 0 --pin=${connectToMobile.pin}`).toString();
      if (connectToMobile.apn)
        execSync(
          `sudo nmcli connection down ppp0 && sudo mmcli -m 0 --simple-connect="${connectToMobile.pin}" && sudo nmcli connection up ppp0`,
        ).toString();
      return response.status(HttpStatus.BAD_REQUEST).send();
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
          const is_interface_exist = execSync(
            'ls /etc/NetworkManager/system-connections/',
          ).toString();
          if (is_interface_exist.includes('Wifi connection'))
            result = execSync(
              `sudo nmcli connection modify "Wifi connection" ssid  ${connectToWifi.ssid}  wifi-sec.key-mgmt wpa-psk wifi-sec.psk ${connectToWifi.password} ipv4.method auto && sudo nmcli con up "Wifi connection"`,
            ).toString();
          else
            result = execSync(
              `sudo nmcli dev wifi connect ${connectToWifi.ssid}  name "Wifi connection" password ${connectToWifi.password}`,
            ).toString();
          console.log('the reult is :', result);
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
