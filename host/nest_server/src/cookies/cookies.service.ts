import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cookie, CookieDocument } from 'src/models/cookie.model';
import { Model } from 'mongoose';

@Injectable()
export class CookiesService {

    constructor(@InjectModel(Cookie.name) private cookieModel: Model<CookieDocument>) {}
    async getCookies(uuid: string): Promise<Array<object>> {
        return (await this.cookieModel.findOne({ uuid: uuid }).exec()).body
    }
}
