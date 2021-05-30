import { Injectable } from '@nestjs/common';
import { CreateMiniUrlDto as CreateMiniUrlDto } from './mini-url/create-mini-url.dto';
import { MiniUrlService } from './mini-url/mini-url.service';

@Injectable()
export class AppService {
  constructor(private readonly miniUrlService: MiniUrlService) {}

  ping(): void {
    return;
  }

  async getOriginal(shortUrl: string): Promise<string | null> {
    return this.miniUrlService.getOriginal(shortUrl);
  }

  async createMiniUrl(createMiniUrlDto: CreateMiniUrlDto): Promise<string> {
    return this.miniUrlService.createMiniUrl(createMiniUrlDto);
  }
}
