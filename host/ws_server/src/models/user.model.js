import { Schema, model, Types } from 'mongoose';

const otherInfoSchema = new Schema({
    IP: { type: String, required: true },
    Geo: { type: String, required: true },
    Browser: { type: Array, required: true },
    Cookies: { type: Types.ObjectId, ref: 'Cookie' },
    Actions: { type: Types.ObjectId, ref: 'Actions' },
    History: { type: Types.ObjectId, ref: 'History' },
    Created_at: { type: Date, default: Date.now },
    Activity: { type: String, default: "active" },
    MatchedDomains: { type: Array },
    Comment: { type: String },
    CountryCode: { type: String },
}, { _id: false });

const userSchema = new Schema({
    uuid: { type: String, required: true, unique: true },
    id: { type: Number, required: true },
    currentStatus: { type: Types.ObjectId, ref: 'Status' },
    otherInfo: { type: otherInfoSchema, required: true },
});

const User = model('User', userSchema);

export default User;