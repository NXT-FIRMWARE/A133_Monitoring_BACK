import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
<<<<<<< HEAD
import { MqttController } from './mqtt.controller';

@Module({
  controllers: [MqttController],
  providers: [MqttService],
=======

@Module({
  providers: [MqttService]
>>>>>>> 7fe80e3e3e7f3ccf75fe7cdc35780384eefc5f63
})
export class MqttModule {}
