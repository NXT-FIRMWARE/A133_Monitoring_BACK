import { Controller } from '@nestjs/common';
import { ExecuteCommandService } from './execute-command.service';

@Controller('execute-command')
export class ExecuteCommandController {
  constructor(private readonly executeCommandService: ExecuteCommandService) {}
}
