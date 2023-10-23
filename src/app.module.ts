import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NetworkModule } from './network/network.module';
import { GeneralModule } from './general/general.module';

@Module({
  imports: [NetworkModule, GeneralModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
