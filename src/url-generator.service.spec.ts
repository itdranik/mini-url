import { Test, TestingModule } from '@nestjs/testing';
import { UrlGeneratorService } from './url-generator.service';

describe('UrlGeneratorService', () => {
  let urlGeneratorService: UrlGeneratorService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [UrlGeneratorService]
    }).compile();

    urlGeneratorService = app.get<UrlGeneratorService>(UrlGeneratorService);
  });

  describe('generate', () => {
    it('should return a random [a-z0-9]{n} string', () => {
      jest
        .spyOn(Math, 'random')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0.05)
        .mockReturnValueOnce(0.95)
        .mockReturnValueOnce(0.92)
        .mockReturnValueOnce(0.99);

      expect(urlGeneratorService.generate(5)).toBe('ab879');
    });
  });
});
