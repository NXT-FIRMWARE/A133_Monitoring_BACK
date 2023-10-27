import { Injectable } from '@nestjs/common';
import { execSync } from 'child_process';

@Injectable()
export class ShellService {
  constructor() {}

  executeCommand(data: any) {
    try {
      return execSync(data).toString();
    } catch (error) {
      return error.message;
    }
  }
}
