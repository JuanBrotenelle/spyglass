import { Schema, model } from 'mongoose';

const currentStatusSchema = new Schema({
    uuid: { type: String, required: true, unique: true },
    currentStatus: { type: String, required: true },
    lastOnline: { type: Date, required: true },
});

const CurrentStatus = model('CurrentStatus', currentStatusSchema);

export default CurrentStatus;