import { Injectable } from '@nestjs/common';
<<<<<<< HEAD

@Injectable()
export class MqttService {}
=======
import * as mqtt from 'mqtt';
import { Cron } from '@nestjs/schedule';

interface QueueBadge {
  badge: string;
  dt: string;
}

@Injectable()
export class MqttService {
  private client: mqtt.MqttClient;

  constructor( ) {
    this.client = mqtt.connect('mqtt://localhost');
    this.client.on('connect', this.onConnect.bind(this));
    this.client.on('message', this.onMessage.bind(this));
  }

  publish(topic:string,message:string) {
    this.client.publish(topic,message)
  } 
  onConnect() {
    console.log('connected');
  }

  onMessage(topic: string, message: string) {
    console.log('message arrived');
    console.log(message.toString());
  }
}
>>>>>>> 7fe80e3e3e7f3ccf75fe7cdc35780384eefc5f63
