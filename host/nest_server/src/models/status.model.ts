import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'currentstatuses' })
export class Status {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  uuid: string;

  @Prop({ type: String })
  currentStatus: 'online' | 'offline' | 'deleted';

  @Prop({ type: Date })
  lastOnline: Date;
}

export type StatusDocument = Status & Document;
export const StatusSchema = SchemaFactory.createForClass(Status);
