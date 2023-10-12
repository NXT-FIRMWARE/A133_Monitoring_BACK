import { Controller } from '@nestjs/common';
import { SerialService } from './serial.service';

@Controller('serial')
export class SerialController {
  constructor(private readonly serialService: SerialService) {}
}
