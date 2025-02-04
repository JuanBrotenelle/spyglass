import { Schema, model } from 'mongoose';

const historySchema = new Schema({
    uuid: { type: String, required: true, unique: true },
    history: { type: Array, required: true },
});

const History = model('History', historySchema);

export default History;