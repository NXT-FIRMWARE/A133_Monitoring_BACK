import { Injectable} from '@nestjs/common';
import { execSync } from 'child_process';
import dgram from 'dgram';
import { networkInterfaces } from 'os';

interface STATUS {
    wlan?:string;
    eth?:string;
    mobile?:string;
    host?:string;
}

@Injectable()
export class NetworkService {
  private port = 5555;
  private client;
  constructor() {
    console.log('discovery init');
    this.client = dgram.createSocket('udp4');
    
    this.client.bind(5555)

    this.bootstrap();
  }
  bootstrap() {
    this.client.on('listening', function () {
        this.client.setBroadcast(true);
        this.setReuseAddress(true);
    });
    this.client.on('message',(message,rinfo)=>{
        console.log(message);
        console.log(rinfo);
    })
  }

  async networkStatus() {
    try {
        const host =  execSync('sudo hostname').toString();
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
          host,
          wifi: wlan0_ip,
          eth: eth0_ip,
          mobile: mobile_ip,
        };
      } catch (error) {
        return {
            host:'',
            wifi:'',
            eth:'',
            mobile:''
        };
      }
  }
}