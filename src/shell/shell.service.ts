import { Injectable } from '@nestjs/common';
import { execSync } from 'child_process';

@Injectable()
export class ShellService {
  constructor() {
    console.log('command execution init');
  }

  executeCommand(data: any) {
    try {
      const result = execSync(data).toString();
      console.log('result', result);
      return result;
    } catch (error) {
      console.log('error', error.message);
      return error.message;
    }
  }
}
