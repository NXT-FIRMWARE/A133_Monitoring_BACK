import { Module, forwardRef } from '@nestjs/common';
import { ExecuteCommandService } from './execute-command.service';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [forwardRef(() => SocketModule)],
  providers: [ExecuteCommandService],
  exports: [ExecuteCommandService],
})
export class ExecuteCommandModule {}
