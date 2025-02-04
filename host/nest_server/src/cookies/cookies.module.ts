import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CookiesController } from './cookies.controller';
import { CookiesService } from './cookies.service';
import { Cookie, CookieSchema } from 'src/models/cookie.model';
import { JwtCustomModule } from 'src/jwt/authjwt/jwt.module';

@Module({
    controllers: [CookiesController],
    providers: [CookiesService],
    imports: [MongooseModule.forFeature([{ name: Cookie.name, schema: CookieSchema }]), JwtCustomModule],
    exports: [CookiesService]
})
export class CookiesModule {}
