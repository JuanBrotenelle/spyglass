import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'histories' })
export class History {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  uuid: string;

  @Prop({ type: [Object] })
  history: Array<object>;

  get historyLength(): number {
    return this.history.length;
  }
}

export type HistoryDocument = History & Document;
export const HistorySchema = SchemaFactory.createForClass(History);
