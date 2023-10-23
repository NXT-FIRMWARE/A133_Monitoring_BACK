import { Module } from '@nestjs/common';
import { NetworkService } from './network.service';
import { NetworkController } from './network.controller';

@Module({
  providers: [NetworkService],
  exports: [NetworkService],
  controllers: [NetworkController],
})
export class NetworkModule {}
