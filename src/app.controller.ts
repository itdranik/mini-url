import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Redirect
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateShortUrlDto } from './create-short-url.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getWelcomePage(): string {
    return this.appService.getWelcomePage();
  }

  @Get(':shortUrl')
  @Redirect()
  redirect(@Param('shortUrl') shortUrl: string): { url: string; statusCode: number } {
    const originalUrl = this.appService.getOriginal(shortUrl);
    if (!originalUrl) {
      throw new NotFoundException(shortUrl);
    }

    return { url: originalUrl, statusCode: HttpStatus.FOUND };
  }

  @Post()
  create(@Body() createShortUrlDto: CreateShortUrlDto): string {
    const shortUrl = this.appService.createShortUrl(createShortUrlDto);
    return `${process.env.DOMAIN}/${shortUrl}`;
  }
}
