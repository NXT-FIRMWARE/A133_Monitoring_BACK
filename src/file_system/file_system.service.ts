import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class FileSystemService {
  getFiles(dir: any) {
    try {
      //joining path of directory
      const directoryPath = path.join(__dirname, dir);
      //passsing directoryPath and callback function
      fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
          return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
          // Do whatever you want to do with the file
          console.log(file);
        });
        return files;
      });
    } catch (error) {
      return error.message;
    }
  }
}
