import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SocketService } from 'src/socket/socket.service';
const prisma = new PrismaClient();

interface Camera {
  cameraName: string;
  rtsp: string;
  ip: string;
  path: string;
  capture_time: number;
  http_server: string;
  ftp_server: string;
  ftp_username: string;
  ftp_password: string;
}

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(forwardRef(() => SocketService))
    private socket: SocketService,
  ) {
    console.log('databse init init');
  }
  async create(Camera: Camera) {
    try {
      await prisma.camera.create({
        data: {
          ip: Camera.ip,
          cameraName: Camera.cameraName,
          rtsp: Camera.rtsp,
          path: Camera.path,
          capture_time: Camera.capture_time,
          http_server: Camera.http_server,
          ftp_server: Camera.ftp_server,
          ftp_username: Camera.ftp_username,
          ftp_password: Camera.ftp_password,
        },
      });

      console.log('camera added successufuly');
    } catch (error) {
      console.log('error', error);
    }
  }

  async findAll() {
    const cameras = await prisma.camera.findMany();
    return cameras;
  }

  async update(Camera: Camera) {
    try {
      await prisma.camera.update({
        where: {
          ip: Camera.ip,
        },
        data: {
          ip: Camera.ip,
          cameraName: Camera.cameraName,
          rtsp: Camera.rtsp,
          path: Camera.path,
          capture_time: Camera.capture_time,
          http_server: Camera.http_server,
          ftp_server: Camera.ftp_server,
          ftp_username: Camera.ftp_username,
          ftp_password: Camera.ftp_password,
        },
      });
    } catch (error) {
      console.log('error', error);
    }
  }
}
