import { Body, Controller, Post } from '@nestjs/common';
import { ShellService } from './shell.service';

@Controller('shell')
export class ShellController {
  constructor(private readonly shellService: ShellService) {}

  @Post()
  getStatus(@Body() data: any) {
    return this.shellService.executeCommand(data.command);
  }
}
