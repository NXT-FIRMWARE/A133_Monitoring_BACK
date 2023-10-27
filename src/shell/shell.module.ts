import { Module } from '@nestjs/common';
import { ShellService } from './shell.service';
import { ShellController } from './shell.controller';

@Module({
  controllers: [ShellController],
  providers: [ShellService],
})
export class ShellModule {}
