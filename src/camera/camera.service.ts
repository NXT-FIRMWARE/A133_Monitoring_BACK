import { Injectable, Inject, Logger, forwardRef } from '@nestjs/common';
import { Recorder } from 'node-rtsp-recorder';
import { Cron, CronExpression } from '@nestjs/schedule';
// import * as data from './data.json';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { SocketService } from 'src/socket/socket.service';
const prisma = new PrismaClient();

interface Recorder {
  recorder: any;
  id: string;
}

@Injectable()
export class CameraService {
  private recorder: Recorder[] = [];
  public date = new Date();
  private logger = new Logger('CAMERA_SERVICE');
  private connected_Cameras = [];

  constructor(
    @Inject(forwardRef(() => SocketService))
    private socket: SocketService,
  ) {
    this.initRecorder();
  }

  async connectedCameras() {
    this.connected_Cameras.length = 0;
    const cameras = await prisma.camera.findMany();
    console.log('cameras', cameras);
    cameras.map((camera) => {
      try {
        execSync(`sudo ping -c 5 ${camera.ip}`).toString();
        console.log(`ping  success  to ${camera.ip}`);
        this.connected_Cameras.push(camera);
      } catch (error) {
        console.log(`ping not success  to ${camera.ip}`);
      }
    });
  }

  async initRecorder() {
    console.log('init Recorder');
    this.date = new Date();
    this.recorder.length = 0;
    this.connected_Cameras.length = 0;
    await this.connectedCameras();
    for (let i = 0; i < this.connected_Cameras.length; i++) {
      const rec = new Recorder({
        url: this.connected_Cameras[i].url,
        folder: this.connected_Cameras[i].path,
        camera: this.connected_Cameras[i].cameraName,
        year: this.date.getFullYear().toString(),
        month: (this.date.getMonth() + 1).toString(),
        day: this.date.getDate().toString(),
        type: 'image',
      });
      this.recorder.push({
        recorder: rec,
        id: this.connected_Cameras[i].ip,
      });
    }
    console.log('lenght after ', this.recorder.length);
  }
  @Cron(CronExpression.EVERY_5_SECONDS)
  captureProcess() {
    this.recorder.map((recItem) => {
      const storage = execSync(
        `df -h ${recItem.recorder.folder} | awk 'NR==2 {print $4}'`,
      ).toString();
      const typeKB = storage.includes('K');
      const sizeValue = +storage.replace(/[GMK]/gi, '');
      console.log('capturing ', !(typeKB && sizeValue < 150));
      if (!(typeKB && sizeValue < 150)) {
        recItem.recorder.captureImage(() => {
          this.logger.log(
            'image saved to ',
            recItem.recorder.folder + recItem.recorder.camera,
          );
        });
      } else {
        this.logger.log('stop Saving in memory ');
      }
    });
  }
}
