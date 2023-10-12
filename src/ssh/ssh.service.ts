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
    try {
      const result = execSync(data).toString();
      this.socket.send('command_result', result);
    } catch (error) {
      error.status; // 0 : successful exit, but here in exception it has to be greater than 0
      console.log('status', error.status);
      error.message; // Holds the message you typically want.
      console.log('status', error.message);
      error.stderr; // Holds the stderr output. Use `.toString()`.
      console.log('status', error.stderr.toString());
      error.stdout; // Holds the stdout output. Use `.toString()`.
      console.log('status', error.stdout.toString());
      this.socket.send('command_result', error.message);
    }
  }
}
