import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './logger.middleware';
import { MiniUrl, MiniUrlSchema } from './mini-url.schema';
import { UrlGeneratorService } from './url-generator.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.development.env' }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        auth: {
          user: configService.get<string>('MONGODB_USER'),
          password: configService.get<string>('MONGODB_PASSWORD')
        }
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forFeature([{ name: MiniUrl.name, schema: MiniUrlSchema }])
  ],
  controllers: [AppController],
  providers: [AppService, UrlGeneratorService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
