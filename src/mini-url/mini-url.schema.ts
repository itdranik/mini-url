import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MiniUrlDocument = MiniUrl & Document;

@Schema()
export class MiniUrl {
  @Prop({ required: true, unique: true })
  shortUrl: string;

  @Prop({ required: true })
  originalUrl: string;
}

export const MiniUrlSchema = SchemaFactory.createForClass(MiniUrl);
