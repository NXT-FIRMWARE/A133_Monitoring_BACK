import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ShellService } from './shell.service';
import { Response } from 'express';
@Controller('shell')
export class ShellController {
  constructor(private readonly shellService: ShellService) {}

  @Post()
  async getStatus(@Res() res: Response, @Body() data: any) {
    const result: string = await this.shellService.executeCommand(data.command);
    if (result.includes('Command failed'))
      return res.status(HttpStatus.BAD_REQUEST).send(result);
    else return res.status(HttpStatus.CREATED).send(result);
  }
}
