import { Module, forwardRef } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [forwardRef(() => SocketModule)],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
