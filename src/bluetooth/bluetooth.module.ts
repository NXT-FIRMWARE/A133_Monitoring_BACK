import { Module } from '@nestjs/common';
import { BluetoothController } from './bluetooth.controller';
import { BluetoothService } from './bluetooth.service';

@Module({
  controllers: [BluetoothController],
  providers: [BluetoothService]
})
export class BluetoothModule {}
