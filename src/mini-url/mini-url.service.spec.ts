import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MiniUrl, MiniUrlSchema } from './mini-url.schema';
import { MiniUrlService } from './mini-url.service';
import { UrlGeneratorService } from './url-generator.service';
import { InternalServerErrorException } from '@nestjs/common';
import { InMemoryMongoModule } from '@app/test-utils/in-memory-mongo/in-memory-mongo.module';
import { InMemoryMongoServer } from '@app/test-utils/in-memory-mongo/in-memory-mongo.server';

describe('MiniUrlService', () => {
  let miniUrlService: MiniUrlService;
  let urlGeneratorService: UrlGeneratorService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          imports: [InMemoryMongoModule],
          useFactory: async (server: InMemoryMongoServer) => {
            return {
              uri: await server.getUri()
            };
          },
          inject: [InMemoryMongoServer]
        }),
        MongooseModule.forFeature([{ name: MiniUrl.name, schema: MiniUrlSchema }])
      ],
      providers: [MiniUrlService, UrlGeneratorService]
    }).compile();

    miniUrlService = module.get<MiniUrlService>(MiniUrlService);
    urlGeneratorService = module.get<UrlGeneratorService>(UrlGeneratorService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(miniUrlService).toBeDefined();
  });

  describe('createMiniUrl', () => {
    it('should return a new generated short URL', async () => {
      jest.spyOn(urlGeneratorService, 'generate').mockReturnValueOnce('short123');

      expect(await miniUrlService.createMiniUrl({ originalUrl: 'https://example.com' })).toBe(
        'short123'
      );
    });

    it('should throw InternalServerErrorException when a short URL is not generated', async () => {
      jest.spyOn(urlGeneratorService, 'generate').mockReturnValue('aaaaaaa');
      await miniUrlService.createMiniUrl({ originalUrl: 'https://first-example.com' });

      await expect(
        miniUrlService.createMiniUrl({ originalUrl: 'https://second-example.com' })
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getOriginal', () => {
    it('should return the previously stored original URL', async () => {
      jest.spyOn(urlGeneratorService, 'generate').mockReturnValueOnce('short123');
      await miniUrlService.createMiniUrl({ originalUrl: 'https://example.com' });

      await expect(miniUrlService.getOriginal('short123')).resolves.toBe('https://example.com');
    });
  });
});
