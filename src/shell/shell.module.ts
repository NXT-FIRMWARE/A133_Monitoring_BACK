import { Module, forwardRef } from '@nestjs/common';
import { ShellService } from './shell.service';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [forwardRef(() => SocketModule)],
  providers: [ShellService],
  exports: [ShellService],
})
export class ShellModule {}
