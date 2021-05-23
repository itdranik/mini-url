import { HttpStatus, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UrlGeneratorService } from './url-generator.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MiniUrl, MiniUrlSchema } from './mini-url.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { closeInMongodConnection, rootMongooseTestModule } from './testUtils/mongo.testUtils';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let urlGeneratorService: UrlGeneratorService;

  beforeEach(async () => {
    process.env.DOMAIN = 'localhost:3000';
    process.env.PORT = String(3000);

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: MiniUrl.name, schema: MiniUrlSchema }])
      ],
      controllers: [AppController],
      providers: [AppService, UrlGeneratorService]
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
    urlGeneratorService = app.get<UrlGeneratorService>(UrlGeneratorService);
  });

  afterEach(async () => {
    await closeInMongodConnection();
  });

  describe('getWelcomePage', () => {
    it('should return a welcoming message', () => {
      expect(appController.getWelcomePage()).toBe('Welcome to yet another URL shortener');
    });
  });

  describe('create', () => {
    it('should generate a new short URL', async () => {
      jest.spyOn(appService, 'createMiniUrl').mockReturnValueOnce(Promise.resolve('abcd777'));

      expect(await appController.create({ originalUrl: 'https://example.com' })).toBe(
        'localhost:3000/abcd777'
      );
    });

    it('should throw InternalServerErrorException when a short URL is not generated', async () => {
      jest.spyOn(urlGeneratorService, 'generate').mockReturnValue('aaaaaaa');
      await appController.create({ originalUrl: 'https://first-example.com' });

      await expect(
        appController.create({ originalUrl: 'https://second-example.com' })
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('redirect', () => {
    it('should return the original link', async () => {
      jest
        .spyOn(appService, 'getOriginal')
        .mockReturnValueOnce(Promise.resolve('http://example.com'));
      expect(await appController.redirect('abcdef1')).toEqual({
        url: 'http://example.com',
        statusCode: HttpStatus.FOUND
      });
    });

    it('should throw NotFoundException if the short URL is unknown', async () => {
      await expect(appController.redirect('abcdef1')).rejects.toThrowError(NotFoundException);
    });
  });
});
