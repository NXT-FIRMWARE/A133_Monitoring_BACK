import { HttpStatus, Injectable } from '@nestjs/common';
import { execSync } from 'child_process';
import { Response } from 'express';

@Injectable()
export class GeneralService {
  getHostname() {
    try {
      return execSync('sudo hostname').toString();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  setHostname(response: Response, hostname: string) {
    try {
      execSync(`sudo hostnamectl set-hostname ${hostname}`).toString();
      return response.status(HttpStatus.CREATED).send();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
