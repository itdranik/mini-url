import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MiniUrl, MiniUrlSchema } from './mini-url.schema';
import { MiniUrlService } from './mini-url.service';
import { UrlGeneratorService } from './url-generator.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: MiniUrl.name, schema: MiniUrlSchema }])],
  providers: [MiniUrlService, UrlGeneratorService],
  exports: [MiniUrlService]
})
export class MiniUrlModule {}
