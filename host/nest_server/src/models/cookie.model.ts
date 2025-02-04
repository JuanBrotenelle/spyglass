import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ collection: "cookies"})
export class Cookie {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  uuid: string;

  @Prop({ type: [Object] })
  body: Array<object>;

  get cookieLength(): number {
    return this.body.length;
  }
}

export type CookieDocument = Cookie & Document;
export const CookieSchema = SchemaFactory.createForClass(Cookie);
