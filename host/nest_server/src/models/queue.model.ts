import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'queues' })
export class Queue {
  @Prop({ required: true })
  uuid: string;

  @Prop({ required: true })
  status: "pending" | "processing" | "completed" | "failed";

  @Prop({ required: true })
  created_at: Date;
}

export type QueueDocument = Queue & Document;
export const QueueSchema = SchemaFactory.createForClass(Queue);
