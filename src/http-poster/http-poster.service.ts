import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { CameraService } from 'src/camera/camera.service';
import * as FormData from 'form-data';

@Injectable()
export class HttpPosterService {
  private path;
  private logger = new Logger('POSTER');

  constructor(private readonly cameraService: CameraService) {}

  async filesUploader() {
    this.logger.log('[d]  upload files to server ...');
    //try {
    const cameraPath = this.getDirectories(this.path); //home/szbaijie
    for (let camerIndex = 0; camerIndex < cameraPath.length; camerIndex++) {
      const yearsPath = this.getDirectories(
        path.join(this.path, cameraPath[camerIndex]),
      );
      for (let yearsIndex = 0; yearsIndex < yearsPath.length; yearsIndex++) {
        const monthsPath = this.getDirectories(
          path.join(this.path, cameraPath[camerIndex], yearsPath[yearsIndex]),
        );
        for (
          let monthsIndex = 0;
          monthsIndex < monthsPath.length;
          monthsIndex++
        ) {
          const daysPath = this.getDirectories(
            path.join(
              this.path,
              cameraPath[camerIndex],
              yearsPath[yearsIndex],
              monthsPath[monthsIndex],
            ),
          );
          for (let daysIndex = 0; daysIndex < daysPath.length; daysIndex++) {
            console.log(
              `${this.path}/${cameraPath[camerIndex]}/${yearsPath[yearsIndex]}/${monthsPath[monthsIndex]}/${daysPath[daysIndex]}`,
            );

            const files = fs.readdirSync(
              path.join(
                this.path,
                cameraPath[camerIndex],
                yearsPath[yearsIndex],
                monthsPath[monthsIndex],
                daysPath[daysIndex],
              ),
            );
            console.log(files);
            for (let i = 0; i < files.length && files.length > 5; i++) {
              console.log('uploading');
              this.PostImage(
                cameraPath[camerIndex],
                path.join(
                  this.path,
                  cameraPath[camerIndex],
                  yearsPath[yearsIndex],
                  monthsPath[monthsIndex],
                  daysPath[daysIndex],
                  files[i],
                ),
                camerIndex,
              );
              fs.unlinkSync(
                path.join(
                  this.path,
                  cameraPath[camerIndex],
                  yearsPath[yearsIndex],
                  monthsPath[monthsIndex],
                  daysPath[daysIndex],
                  files[i],
                ),
              );
            }
          }
        }
      }
    }
  }

  getDirectories(path) {
    return fs.readdirSync(path);
  }

  async PostImage(fullPath: string, cameraName: string, http_server: string) {
    // const filename = 'C:/Users/jbray/Desktop/hello.png';
    console.log(cameraName);
    const formDataRequest = new FormData();
    const image = await fs.createReadStream(fullPath);
    formDataRequest.append('image', image);
    formDataRequest.append('time', new Date().toLocaleString());
    formDataRequest.append('name', cameraName);

    await axios
      .post(http_server, formDataRequest, {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        //handle success
        console.log(response.data);
        //delete image
        this.deleteImage(fullPath);
        //To  DO remove image from folder
      })
      .catch((error) => {
        //handle error
        console.log(`${error}`);
      });
  }
  async deleteImage(path: string) {
    return fs.unlinkSync(path);
  }
}
