import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MqttModule } from './mqtt/mqtt.module';
import { NetworkModule } from './network/network.module';
import { GeneralModule } from './general/general.module';
import { PerformanceModule } from './performance/performance.module';
<<<<<<< HEAD
import { ShellModule } from './shell/shell.module';
=======
import { CommunicationModule } from './communication/communication.module';
import { SocketModule } from './socket/socket.module';
>>>>>>> c806c03be6df8975fce3237c833d8f7dfda6129e

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
<<<<<<< HEAD
    ShellModule,
=======
    CommunicationModule,
    SocketModule,
>>>>>>> c806c03be6df8975fce3237c833d8f7dfda6129e
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
