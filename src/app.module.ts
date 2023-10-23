import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MqttModule } from './mqtt/mqtt.module';
import { NetworkModule } from './network/network.module';
import { GeneralModule } from './general/general.module';
import { PerformanceModule } from './performance/performance.module';

@Module({
  imports: [
    GeneralModule,
    NetworkModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'A133_MANAGER_FRONT', 'dist'),
      exclude: ['/api/(.*)'],
    }),
    MqttModule,
    PerformanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
