import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateShortUrlDto } from './create-short-url.dto';
import { UrlGeneratorService } from './url-generator.service';

@Injectable()
export class AppService {
  private static readonly GENERATE_ATTEMPTS_MAX_COUNT = 5;
  private static readonly SHORT_URL_LENGTH = 7;

  constructor(private readonly urlGeneratorService: UrlGeneratorService) {}

  private readonly logger = new Logger(AppService.name);

  private readonly mapping = new Map<string, string>();

  getWelcomePage(): string {
    return 'Welcome to yet another URL shortener';
  }

  getOriginal(shortUrl: string): string | null {
    return this.mapping.get(shortUrl) ?? null;
  }

  createShortUrl(createShortUrlDto: CreateShortUrlDto): string {
    for (let i = 0; i < AppService.GENERATE_ATTEMPTS_MAX_COUNT; ++i) {
      const shortUrl = this.urlGeneratorService.generate(AppService.SHORT_URL_LENGTH);
      if (!this.mapping.has(shortUrl)) {
        this.mapping.set(shortUrl, createShortUrlDto.originalUrl);
        return shortUrl;
      }
    }

    this.logger.error(
      [
        `Short url wasn't generated after ${AppService.GENERATE_ATTEMPTS_MAX_COUNT} attempts`,
        'due to collisions, consider increasing the length of short URLs'
      ].join(' ')
    );
    throw new InternalServerErrorException('Oops... Something wrong happened');
  }
}
