import { Module } from '@nestjs/common';
import { HttpPosterService } from './http-poster.service';

@Module({
  providers: [HttpPosterService],
  exports: [HttpPosterService],
})
export class HttpPosterModule {}
