import { IsUrl } from 'class-validator';

export class CreateShortUrlDto {
  @IsUrl()
  originalUrl: string;
}
