import { Schema, model } from 'mongoose';

const queueSchema = new Schema({
    uuid: { type: String, required: true },
    status: { type: String, enum: ["pending", "processing", "completed", "failed"], required: true },
    created_at: { type: Date, required: true },
});

const Queue = model('Queue', queueSchema);

export default Queue;