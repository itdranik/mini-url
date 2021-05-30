import { Injectable } from '@nestjs/common';

@Injectable()
export class UrlGeneratorService {
  private static readonly AVAILABLE_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

  generate(shortUrlLength: number): string {
    const result = [];

    for (let i = 0; i < shortUrlLength; ++i) {
      const charId = Math.floor(Math.random() * UrlGeneratorService.AVAILABLE_CHARS.length);
      result.push(UrlGeneratorService.AVAILABLE_CHARS[charId]);
    }

    return result.join('');
  }
}
