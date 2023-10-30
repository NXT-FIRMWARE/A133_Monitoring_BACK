import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class FileSystemService {
  getFiles(dir: string) {
    try {
      const directoryPath = path.join(__dirname, dir);
      fs.readdir(directoryPath, function (err, files) {
        if (err) {
          return console.log('Unable to scan directory: ' + err);
        }
        files.forEach(function (file) {
          console.log(file);
        });
        return files;
      });
    } catch (error) {
      return error.message;
    }
  }
}
