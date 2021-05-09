import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlGeneratorService } from './url-generator.service';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.development.env' })],
  controllers: [AppController],
  providers: [AppService, UrlGeneratorService]
})
export class AppModule {}
