import { Inject, Injectable, forwardRef } from '@nestjs/common';
import * as si from 'systeminformation';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class PerformanceService {
  constructor(
    @Inject(forwardRef(() => SocketService))
    private socket: SocketService,
  ) {
    console.log('performance init');
  }

  async getCpuUsage() {
    try {
      const cpuData = await si.fullLoad();
      this.socket.send('cpu', cpuData);
    } catch (error) {
      console.error('Error getting CPU data:', error);
      this.socket.send('cpu', error);
    }
  }

  async getMemoryUsage() {
    try {
      const memoryData = await si.mem();
      this.socket.send('memory', {
        total_GB: (memoryData.total / (1024 * 1024 * 1024)).toFixed(2),
        free_GB: (memoryData.available / (1024 * 1024 * 1024)).toFixed(2),
        used_GB: (memoryData.active / (1024 * 1024 * 1024)).toFixed(2),
      });
    } catch (error) {
      console.error('Error getting memory data:', error);
      this.socket.send('memory', error);
    }
  }

  async getDiskUsage() {
    try {
      const Storage_Data = await si.fsSize();
      const storage_Data_Filtered = Storage_Data.map((storage) => ({
        partition: storage.fs,
        total_GB: (storage.size / (1024 * 1024 * 1024)).toFixed(2),
        used_GB: (storage.used / (1024 * 1024 * 1024)).toFixed(2),
        available_GB: (storage.available / (1024 * 1024 * 1024)).toFixed(2),
        mounted_on: storage.mount,
      }));
      this.socket.send('storage', storage_Data_Filtered);
    } catch (error) {
      console.error('Error getting disk data:', error);
      this.socket.send('storage', error);
    }
  }

  async getBatteryUsage(): Promise<any> {
    try {
      const diskBattery = await si.battery();
      this.socket.send('battery', diskBattery.percent);
    } catch (error) {
      console.error('Error getting battery data:', error);
      this.socket.send('battery', error);
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
