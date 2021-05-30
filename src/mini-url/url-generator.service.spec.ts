import { Test, TestingModule } from '@nestjs/testing';
import { UrlGeneratorService } from './url-generator.service';

describe('UrlGeneratorService', () => {
  let service: UrlGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlGeneratorService]
    }).compile();

    service = module.get<UrlGeneratorService>(UrlGeneratorService);
  });

  it('should return a random [a-z0-9]{n} string', () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.05)
      .mockReturnValueOnce(0.95)
      .mockReturnValueOnce(0.92)
      .mockReturnValueOnce(0.99);

    expect(service.generate(5)).toBe('ab879');
  });
});
