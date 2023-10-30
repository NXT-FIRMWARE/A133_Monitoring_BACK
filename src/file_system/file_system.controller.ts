import { Body, Controller, Post } from '@nestjs/common';
import { FileSystemService } from './file_system.service';

@Controller('fileSys')
export class FileSystemController {
  constructor(private readonly fileSystemService: FileSystemService) {}

  @Post('list')
  async getFiles(@Body() data: any) {
    return this.fileSystemService.getFiles(data.path);
  }
}
