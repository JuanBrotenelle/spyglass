import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'images' })
export class Image {
  @Prop({ required: true, unique: true })
  uuid: string;

  @Prop({ required: true })
  src: Array<string>;

  @Prop({ required: true })
  created_at: Date
}

export type ImageDocument = Image & Document;
export const ImageSchema = SchemaFactory.createForClass(Image);
