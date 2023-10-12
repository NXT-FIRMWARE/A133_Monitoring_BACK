import * as readline from 'readline';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { SocketService } from 'src/socket/socket.service';
import { spawn } from 'child_process';
@Injectable()
export class SshService {
  constructor(
    @Inject(forwardRef(() => SocketService))
    private socket: SocketService,
  ) {
    console.log('command execution init');
  }

  executeCommand() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter a command (Ctrl+C to exit): ', (command) => {
      if (command === '') {
        this.executeCommand(); // Prompt again if no command is entered
        return;
      }

      if (command === 'cd ..') {
        process.chdir('..'); // Change the current working directory
        console.log(`Changed directory to: ${process.cwd()}`);
        this.executeCommand(); // Prompt for the next command
        return;
      }

      const childProcess = spawn(command, { shell: true });

      childProcess.stdout.on('data', (data) => {
        console.log(`Command Output: ${data}`);
      });

      childProcess.stderr.on('data', (data) => {
        console.error(`Command Error: ${data}`);
      });

      childProcess.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
        this.executeCommand(); // Prompt for the next command
      });
    });
  }
}
