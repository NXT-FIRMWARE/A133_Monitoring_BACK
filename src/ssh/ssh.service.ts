import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { SocketService } from 'src/socket/socket.service';
import * as readline from 'readline';
import { Client } from 'ssh2';
@Injectable()
export class SshService {
  constructor(
    @Inject(forwardRef(() => SocketService))
    private socket: SocketService,
  ) {
    console.log('ssh init');
  }
  public ssh_Session;

  consol() {
    console.log('jawad');
  }

  connect_ssh(data: any) {
    this.ssh_Session = new Client();
    this.ssh_Session
      .on('ready', function () {
        console.log('Client :: ready');
        this.ssh_Session.shell(function (err, stream) {
          if (err) {
            console.log('error');
            throw err;
          }
          // create readline interface
          const rl = readline.createInterface(process.stdin, process.stdout);

          stream
            .on('close', function () {
              process.stdout.write('Connection closed.');
              console.log('Stream :: close');
              this.ssh_Session.end();
            })
            .on('data', function (data) {
              // // pause to prevent more data from coming in
              // process.stdin.pause();
              // process.stdout.write(data);
              // process.stdin.resume();
              this.socket.send('ssh_send', data);
            })
            .stderr.on('data', function (data) {
              process.stderr.write(data);
            });

          rl.on('line', function (d) {
            // send data to through the client to the host
            stream.write(d.trim() + '\n');
          });

          rl.on('SIGINT', function () {
            // stop input
            process.stdin.pause();
            process.stdout.write('\nEnding session\n');
            rl.close();

            // close connection
            stream.end('exit\n');
          });
        });
      })
      .on('error', function (err) {
        console.log('error', err.message);
      })
      .connect({
        host: data.ip,
        port: 22,
        username: data.username,
        password: data.password,
      });
  }
}
