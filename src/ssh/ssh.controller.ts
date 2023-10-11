import { Controller } from '@nestjs/common';
import { SshService } from './ssh.service';

@Controller('ssh')
export class SshController {
  constructor(private readonly sshService: SshService) {}
}
