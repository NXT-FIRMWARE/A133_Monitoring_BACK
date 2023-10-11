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

  consol() {
    console.log('jawad');
  }

  connect_ssh(data: any) {
    const conn = new Client();
    conn
      .on('ready', function () {
        console.log('Client :: ready');
        conn.shell(function (err, stream) {
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
              conn.end();
            })
            .on('data', function (data) {
              // pause to prevent more data from coming in
              console.log('socket,', this.socket);
              this.consol();
              process.stdin.pause();
              process.stdout.write(data);
              process.stdin.resume();
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
