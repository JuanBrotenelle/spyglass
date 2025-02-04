import { Schema, model } from 'mongoose';

const cookieSchema = new Schema({
    uuid: { type: String, required: true, unique: true },
    body: { type: Array, required: true },
});

const Cookie = model('Cookie', cookieSchema);

export default Cookie;