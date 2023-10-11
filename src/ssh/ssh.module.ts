import { Module, forwardRef } from '@nestjs/common';
import { SshService } from './ssh.service';
import { SshController } from './ssh.controller';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [forwardRef(() => SocketModule)],
  controllers: [SshController],
  providers: [SshService],
  exports: [SshService],
})
export class SshModule {}
