import { HttpStatus, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UrlGeneratorService } from './url-generator.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let urlGeneratorService: UrlGeneratorService;

  beforeEach(async () => {
    process.env.DOMAIN = 'localhost:3000';
    process.env.PORT = String(3000);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, UrlGeneratorService]
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
    urlGeneratorService = app.get<UrlGeneratorService>(UrlGeneratorService);
  });

  describe('getWelcomePage', () => {
    it('should return a welcoming message', () => {
      expect(appController.getWelcomePage()).toBe('Welcome to yet another URL shortener');
    });
  });

  describe('create', () => {
    it('should generate a new short URL', () => {
      jest.spyOn(appService, 'createShortUrl').mockReturnValueOnce('abcd777');

      expect(appController.create({ originalUrl: 'https://example.com' })).toBe(
        'localhost:3000/abcd777'
      );
    });

    it('should throw InternalServerErrorException when a short URL isa not generated', () => {
      jest.spyOn(urlGeneratorService, 'generate').mockReturnValue('aaaaaaa');
      appController.create({ originalUrl: 'https://first-example.com' });

      expect(() =>
        appController.create({ originalUrl: 'https://second-example.com' })
      ).toThrowError(InternalServerErrorException);
    });
  });

  describe('redirect', () => {
    it('should return the original link', () => {
      jest.spyOn(appService, 'getOriginal').mockReturnValueOnce('http://example.com');
      expect(appController.redirect('abcdef1')).toEqual({
        url: 'http://example.com',
        statusCode: HttpStatus.FOUND
      });
    });

    it('should throw NotFoundException if the short URL is unknown', () => {
      expect(() => appController.redirect('abcdef1')).toThrowError(NotFoundException);
    });
  });
});
