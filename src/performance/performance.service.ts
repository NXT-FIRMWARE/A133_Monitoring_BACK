import { Injectable } from '@nestjs/common';
import { execSync } from 'child_process';
import * as si from 'systeminformation';

@Injectable()
export class PerformanceService {
  constructor() {
    console.log('performance init');
  }

  async getPerformance() {
    try {
      const cpuData = (await si.currentLoad()).currentLoad;
      const memoryData = await si.mem();
      const memory = {
        total: (memoryData.total / (1024 * 1024 * 1024)).toFixed(2),
        // free_GB: (memoryData.available / (1024 * 1024 * 1024)).toFixed(2),
        used: (memoryData.active / (1024 * 1024 * 1024)).toFixed(2),
      };
      const Storage_Data = await si.fsSize();
      const storage_Data_Filtered = Storage_Data.map((storage) => ({
        // partition: storage.fs,
        total: (storage.size / (1024 * 1024 * 1024)).toFixed(2),
        used: (storage.used / (1024 * 1024 * 1024)).toFixed(2),
        // available_GB: (storage.available / (1024 * 1024 * 1024)).toFixed(2),
        // mounted_on: storage.mount,
      }));

      return {
        cpu: cpuData.toFixed(2),
        memory: memory,
        storage: storage_Data_Filtered[0],
      };
    } catch (error) {
      return 'error';
    }
  }

  async processes() {
    try {
      const result = await si
        .processes()
        .then((services) => {
          return services.list;
        })
        .catch((error) => {
          console.log(error);
          return error.message;
        });
      return result;
    } catch (error) {
      return error.message;
    }
  }

  async killProcess(pid: number) {
    try {
      execSync(`sudo kill -9 ${pid}`);
    } catch (error) {
      return error.message;
    }
  }
}
