import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMiniUrlDto } from './create-mini-url.dto';
import { MiniUrl, MiniUrlDocument } from './mini-url.schema';
import { MongoDbError } from './mongo.constants';
import { UrlGeneratorService } from './url-generator.service';

@Injectable()
export class MiniUrlService {
  private static readonly GENERATE_ATTEMPTS_MAX_COUNT = 5;
  private static readonly SHORT_URL_LENGTH = 7;

  constructor(
    private readonly urlGeneratorService: UrlGeneratorService,
    @InjectModel(MiniUrl.name) private miniUrlModel: Model<MiniUrlDocument>
  ) {}

  private readonly logger = new Logger(MiniUrlService.name);

  async getOriginal(shortUrl: string): Promise<string | null> {
    const miniUrl = await this.miniUrlModel.findOne({ shortUrl: shortUrl }).exec();
    if (!miniUrl) {
      return null;
    }
    return miniUrl.originalUrl;
  }

  async createMiniUrl(createMiniUrlDto: CreateMiniUrlDto): Promise<string> {
    for (let i = 0; i < MiniUrlService.GENERATE_ATTEMPTS_MAX_COUNT; ++i) {
      const shortUrl = this.urlGeneratorService.generate(MiniUrlService.SHORT_URL_LENGTH);
      const createdMiniUrl = new this.miniUrlModel({
        shortUrl: shortUrl,
        originalUrl: createMiniUrlDto.originalUrl
      });

      try {
        await createdMiniUrl.save();
        return shortUrl;
      } catch (e) {
        if (e.code !== MongoDbError.DUPLICATE_KEY_ERROR_INDEX) {
          throw e;
        }

        this.logger.error(`Collision detected for shortUrl=${shortUrl}`);
      }
    }

    this.logger.error(
      [
        `Short url wasn't generated after ${MiniUrlService.GENERATE_ATTEMPTS_MAX_COUNT} attempts`,
        'due to collisions, consider increasing the length of short URLs'
      ].join(' ')
    );
    throw new InternalServerErrorException('Oops... Something wrong happened');
  }
}
