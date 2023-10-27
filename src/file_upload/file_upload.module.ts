import { Module } from '@nestjs/common';
import { FileUploadController } from './file_upload.controller';

@Module({
  controllers: [FileUploadController],
})
export class FileUploadModule {}
