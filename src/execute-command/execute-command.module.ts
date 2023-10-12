import { Module, forwardRef } from '@nestjs/common';
import { ExecuteCommandService } from './execute-command.service';
import { ExecuteCommandController } from './execute-command.controller';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [forwardRef(() => SocketModule)],
  controllers: [ExecuteCommandController],
  providers: [ExecuteCommandService],
  exports: [ExecuteCommandService],
})
export class ExecuteCommandModule {}
