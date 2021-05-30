import { HttpStatus, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MiniUrlService } from './mini-url/mini-url.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const miniUrlService = {
    createMiniUrl: jest.fn(),
    getOriginal: jest.fn()
  };

  beforeEach(async () => {
    process.env.DOMAIN = 'localhost:3000';
    process.env.PORT = String(3000);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: MiniUrlService,
          useValue: miniUrlService
        }
      ]
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('ping', () => {
    it('should be ok', () => {
      const appServicePingRef = jest.spyOn(appService, 'ping');
      appController.ping();
      expect(appServicePingRef).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should return a generated short URL', async () => {
      miniUrlService.createMiniUrl.mockResolvedValueOnce('short123');
      expect(await appController.create({ originalUrl: 'https://example.com' })).toBe(
        'localhost:3000/short123'
      );
    });
  });

  describe('redirect', () => {
    it('should return the original URL', async () => {
      miniUrlService.getOriginal.mockResolvedValueOnce('https://example.com');
      await expect(appController.redirect('short123')).resolves.toEqual({
        url: 'https://example.com',
        statusCode: HttpStatus.FOUND
      });
    });

    it('should throw NotFoundException if a short URL is unknown', async () => {
      miniUrlService.getOriginal.mockResolvedValueOnce(null);
      await expect(appController.redirect('short123')).rejects.toThrowError(NotFoundException);
    });
  });
});
