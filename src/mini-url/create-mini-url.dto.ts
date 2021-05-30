import { IsUrl } from 'class-validator';

export class CreateMiniUrlDto {
  @IsUrl()
  originalUrl: string;
}
