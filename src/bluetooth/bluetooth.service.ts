import { Injectable } from '@nestjs/common';
// import * as Bluetooth from 'node-bluetooth';
const Bluetooth = require('node-bluetooth');

@Injectable()
export class BluetoothService {
    private adapter: any;
    constructor(){
        this.adapter = new Bluetooth();
    }
    async acticateBluetooth(){
        await this.adapter.on();
    }

    async scanForDevices() {
        const devices =await this.adapter.discover();
        return devices;
    }

}
