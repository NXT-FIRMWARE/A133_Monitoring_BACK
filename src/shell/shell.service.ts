import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { execSync } from 'child_process';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class ShellService {
  constructor(
    @Inject(forwardRef(() => SocketService))
    private socket: SocketService,
  ) {
    console.log('command execution init');
  }

  executeCommand(data: any) {
    try {
      const result = execSync(data).toString();
      this.socket.send('command_result', result);
    } catch (error) {
      console.log('status', error.message);
      this.socket.send('command_result', error.message);
    }
  }
}
