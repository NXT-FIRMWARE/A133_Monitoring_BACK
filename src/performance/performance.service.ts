import { Injectable } from '@nestjs/common';
import * as si from 'systeminformation';
import { Cron } from '@nestjs/schedule';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class PerformanceService {
  constructor(private socket: SocketService) {
    console.log('performance init');
  }

  @Cron('* * * * * *')
  async getCpuUsage() {
    try {
      const cpuData = await si.fullLoad();
      this.socket.send('cpu', cpuData);
    } catch (error) {
      console.error('Error getting CPU data:', error);
      throw error;
    }
  }

  @Cron('* * * * * *')
  async getMemoryUsage() {
    try {
      const memoryData = await si.mem();
      this.socket.send('memory', {
        total_GB: (memoryData.total / (1024 * 1024 * 1024)).toFixed(2),
        free_GB: (memoryData.free / (1024 * 1024 * 1024)).toFixed(2),
        used_GB: (memoryData.used / (1024 * 1024 * 1024)).toFixed(2),
      });
    } catch (error) {
      console.error('Error getting memory data:', error);
      throw error;
    }
  }

  @Cron('* * * * * *')
  async getDiskUsage() {
    try {
      const diskData = await si.fsSize();
      const filtered = diskData.map((element) => ({
        partition: element.fs,
        total_GB: (element.size / (1024 * 1024 * 1024)).toFixed(2),
        used_GB: (element.used / (1024 * 1024 * 1024)).toFixed(2),
        available_GB: (element.available / (1024 * 1024 * 1024)).toFixed(2)
      }));
      this.socket.send('disk', filtered);
    } catch (error) {
      console.error('Error getting disk data:', error);
      throw error;
    }
  }

  @Cron('* * * * * *')
  async getBatteryUsage(): Promise<any> {
    try {
      const diskBattery = await si.battery();
      this.socket.send('battery', diskBattery.percent);
    } catch (error) {
      console.error('Error getting battery data:', error);
      throw error;
    }
  }

  // @Cron('* * * * * *')
  // async getProcesses(): Promise<any> {
  //   try {
  //     const processes = await si.processes();
  //     this.socket.send('processes', processes);
  //   } catch (error) {
  //     console.error('Error getting processes data:', error);
  //     throw error;
  //   }
  // }
}
