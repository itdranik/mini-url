import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './logger.middleware';
import { UrlGeneratorService } from './url-generator.service';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.development.env' })],
  controllers: [AppController],
  providers: [AppService, UrlGeneratorService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
