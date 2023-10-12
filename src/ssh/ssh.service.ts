import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { execSync } from 'child_process';
import { platform } from 'os';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class SshService {
  constructor(
    @Inject(forwardRef(() => SocketService))
    private socket: SocketService,
  ) {
    console.log('command execution init');
  }

  executeCommand(data: any) {
    let result = '';
    if (platform() === 'linux') {
      try {
        result = execSync(data).toString();
        console.log('the reult is :', result);
        if (result.toString().includes('Error'))
          this.socket.send('comand_result', result);
        else {
          this.socket.send('comand_result', result);
        }
      } catch (error) {
        this.socket.send('comand_result', error);
      }
    }
  }
}
