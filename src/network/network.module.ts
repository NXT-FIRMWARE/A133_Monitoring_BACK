import { Module } from '@nestjs/common';
import { NetworkService } from './network.service';
import { NetworkController } from './network.controller';
import { DiscoveryService } from './discovery.service';

@Module({
  providers: [NetworkService,DiscoveryService],
  exports: [NetworkService],
  controllers: [NetworkController],
})
export class NetworkModule {}
