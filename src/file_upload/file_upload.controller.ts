import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as decompress from 'decompress';
import { createExtractorFromFile } from 'node-unrar-js';

@Controller('upload')
export class FileUploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          // let path;
          const { path } = JSON.parse(JSON.stringify(req.body));
          fs.mkdir(path, { recursive: true }, (err) => {
            if (err) return fs.mkdir(path, (error) => callback(error, path));
          });
          return callback(null, path);
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
      fileFilter: (req: any, file, cb) => {
        const ext = path.extname(file.originalname);
        console.log('ext', ext);
        if (ext !== '.zip' && ext !== '.rar')
          return cb(new Error(`this type ${file.mimetype} not allowed`), false);
        return cb(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (path.extname(file.originalname) === '.zip') {
        decompress(file.path, file.destination)
          .then((files) => {
            console.log(files);
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (path.extname(file.originalname) === '.rar') {
        try {
          // Create the extractor with the file information (returns a promise)
          const extractor = await createExtractorFromFile({
            filepath: file.path,
            targetPath: file.destination,
          });

          // Extract the files
          [...extractor.extract().files];
        } catch (err) {
          // May throw UnrarError, see docs
          console.error(err);
        }
      }
      // console.log('des:', destination);
    } catch (error) {
      console.log(error);
    }
    return 'file saved';
  }

}
