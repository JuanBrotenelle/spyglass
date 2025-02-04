import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'auth' })
export class Auth {
    @Prop({ type: Types.ObjectId, auto: true })
    _id: Types.ObjectId

    @Prop({ required: true })
    login: string

    @Prop({ required: true })
    password: string
}

export type AuthDocument = Auth & Document
export const AuthSchema = SchemaFactory.createForClass(Auth)