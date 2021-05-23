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
import { CreateMiniUrlDto } from './create-mini-url.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getWelcomePage(): string {
    return this.appService.getWelcomePage();
  }

  @Get(':shortUrl')
  @Redirect()
  async redirect(
    @Param('shortUrl') shortUrl: string
  ): Promise<{ url: string; statusCode: number }> {
    const originalUrl = await this.appService.getOriginal(shortUrl);
    if (!originalUrl) {
      throw new NotFoundException(shortUrl);
    }

    return { url: originalUrl, statusCode: HttpStatus.FOUND };
  }

  @Post()
  async create(@Body() createMiniUrlDto: CreateMiniUrlDto): Promise<string> {
    const shortUrl = await this.appService.createMiniUrl(createMiniUrlDto);
    return `${process.env.DOMAIN}/${shortUrl}`;
  }
}
