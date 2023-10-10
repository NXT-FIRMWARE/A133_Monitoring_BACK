import { Controller, Get, Post } from '@nestjs/common';
import {BluetoothService} from './bluetooth.service'

@Controller('bluetooth')
export class BluetoothController {
    constructor(private readonly bleService: BluetoothService){}
    @Post('activate')
    async acticateBluetooth(){
        await this.bleService.acticateBluetooth();
        return { message: 'Bluetooth acticated'}
    }
    @Get('scan')
    async scanForDevices(){
        const devices = await this.bleService.scanForDevices();
        return { devices };
    }

}
