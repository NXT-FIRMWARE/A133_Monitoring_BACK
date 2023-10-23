import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MqttModule } from './mqtt/mqtt.module';
<<<<<<< HEAD
=======
import { NetworkModule } from './network/network.module';
import { GeneralModule } from './general/general.module';
>>>>>>> 7fe80e3e3e7f3ccf75fe7cdc35780384eefc5f63
@Module({
  imports: [
    GeneralModule,
    NetworkModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'A133_MANAGER_FRONT', 'dist'),
      exclude: ['/api/(.*)'],
    }),
    MqttModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
