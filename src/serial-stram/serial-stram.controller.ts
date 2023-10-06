import { Controller } from '@nestjs/common';
import { SerialStramService } from './serial-stram.service';

@Controller('serial-stram')
export class SerialStramController {
  constructor(private readonly serialStramService: SerialStramService) {}
}
