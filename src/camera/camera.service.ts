import { Injectable, Inject, Logger, forwardRef } from '@nestjs/common';
import { Recorder } from 'node-rtsp-recorder';
import axios from 'axios';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { SocketService } from 'src/socket/socket.service';
import * as fs from 'fs';
import * as FormData from 'form-data';
const prisma = new PrismaClient();

interface Recorder {
  recorder: any;
  id: string;
  capture_time: number;
  http_server?: string;
  ftp_server?: string;
  ftp_username?: string;
  ftp_password?: string;
}

@Injectable()
export class CameraService {
  private recorder: Recorder[] = [];
  public date = new Date();
  private logger = new Logger('CAMERA_SERVICE');
  private connected_Cameras = [];
  private clearRecording: NodeJS.Timeout[] = [];

  constructor(
    @Inject(forwardRef(() => SocketService))
    private socket: SocketService,
  ) {
    this.initRecorder();
  }

  async connectedCameras() {
    this.connected_Cameras.length = 0;
    const cameras = await prisma.camera.findMany();
    cameras.map((camera) => {
      try {
        execSync(`sudo ping -c 5 ${camera.ip}`).toString();
        console.log(`ping  success  to ${camera.ip}`);
        this.connected_Cameras.push(camera);
      } catch (error) {
        console.log(`ping not success  to ${camera.ip}`);
      }
    });
    //test if there is any camera connecetd
    if (this.connected_Cameras.length === 0)
      this.socket.send('connected_cameras', 'no camera atatched');
    else {
      console.log('ping', this.connected_Cameras);
      const connected_cams = this.connected_Cameras.map((camera) => ({
        ip: camera.ip,
        cameraName: camera.cameraName,
      }));
      this.socket.send('connected_cameras', connected_cams);
    }
  }

  async initRecorder() {
    console.log('init Recorder');
    this.date = new Date();
    this.recorder.length = 0;
    await this.connectedCameras();
    for (let i = 0; i < this.connected_Cameras.length; i++) {
      const rec = new Recorder({
        rtsp: this.connected_Cameras[i].rtsp,
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
        capture_time: this.connected_Cameras[i].capture_time,
        http_server: this.connected_Cameras[i].http_server,
      });
    }
    console.log('recorder ', this.recorder);
  }

  captureProcess() {
    //test if there is any camera connecetd
    if (this.recorder.length === 0)
      this.socket.send('camera', 'no camera atatched');
    this.recorder.map((recItem) => {
      const clearing = setInterval(() => {
        const storage = execSync(
          `df -h ${recItem.recorder.folder} | awk 'NR==2 {print $4}'`,
        ).toString();
        const typeKB = storage.includes('K');
        const sizeValue = +storage.replace(/[GMK]/gi, '');
        console.log('capturing ', !(typeKB && sizeValue < 150));
        if (!(typeKB && sizeValue < 150)) {
          recItem.recorder.captureImage((fullPath) => {
            this.logger.log('fullPath', fullPath);
            if (recItem.http_server)
              this.PostImage(
                fullPath,
                recItem.recorder.camera,
                recItem.http_server,
              );
          });
        } else {
          this.logger.log('stop Saving in memory ');
        }
      }, recItem.capture_time);
      this.clearRecording.push(clearing);
    });
  }

  async stopCaptureProcess() {
    console.log('stop recording');
    this.clearRecording.map((clearCam) => {
      clearInterval(clearCam);
    });
  }

  async PostImage(fullPath: string, cameraName: string, http_server: string) {
    // const filename = 'C:/Users/jbray/Desktop/hello.png';
    console.log(cameraName);
    const formDataRequest = new FormData();
    const image = await fs.createReadStream(fullPath);
    formDataRequest.append('image', image);
    formDataRequest.append('time', new Date().toLocaleString());
    formDataRequest.append('name', cameraName);
    try {
      console.log('post image ....');
      const result = await axios.post(`${http_server}`, formDataRequest, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      this.logger.log(result.data);
      //delete image
      //this.deleteImage(fullPath);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
