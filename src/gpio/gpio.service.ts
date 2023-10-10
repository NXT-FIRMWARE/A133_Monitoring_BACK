import { Injectable } from '@nestjs/common';
import { execSync } from 'child_process';

@Injectable()
export class GpioService {
    async executeGpioCommand(status: number, gpio: string): Promise<string> {
        const command = this.constructGpioCommand(status, gpio);

        try {
            execSync(command.write)
            await this.delay(1);
            const output = execSync(command.read).toString();
            console.log("output: " + output);
            const stateMatch = output.match(/gpio port \w+: (\d+)/);
            if (stateMatch && stateMatch[1]) {
                const state = stateMatch[1];
                return state;
            } else {
                throw new Error('Unable to extract GPIO state from output.');
            }
        } catch (error) {
            throw new Error(`Error executing GPIO command: ${error}`);
        }
    }

    private constructGpioCommand(status: number, gpio: string): { write: string; read: string } {
        if (status === 1 && gpio === 'GPIOPD21') {
            return { write: 'sudo gpio-test.64 w d 21 1', read: 'sudo gpio-test.64 r d 21' };
        } else if (status === 1 && gpio === 'GPIOPH19') {
            return { write: 'sudo gpio-test.64 w h 19 1', read: 'sudo gpio-test.64 r h 19' };
        } else if (status === 0 && gpio === 'GPIOPD21') {
            return { write: 'sudo gpio-test.64 w d 21 0', read: 'sudo gpio-test.64 r d 21' };
        } else if (status === 0 && gpio === 'GPIOPH19') {
            return { write: 'sudo gpio-test.64 w h 19 0', read: 'sudo gpio-test.64 r h 19' };
        } else {
            throw new Error('Invalid status or GPIO');
        }
    }
    delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
}
