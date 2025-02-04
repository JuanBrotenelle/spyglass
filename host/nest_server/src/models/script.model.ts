import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'scripts' })
export class Script {
    @Prop({ required: true, unique: true })
    uuidFile: string;

    @Prop({ required: true })
    domain: string;

    @Prop({ required: true })
    file: string;
    
    @Prop({ required: true })
    color: string;

    @Prop({ required: true })
    created_at: Date;
}

export type ScriptDocument = Script & Document;
export const ScriptSchema = SchemaFactory.createForClass(Script);
