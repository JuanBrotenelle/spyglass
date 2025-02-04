import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { CookiesService } from './cookies.service';
import { BodyGuard } from 'src/jwt/jwt.guard';

@Controller('api/v1/cookies')
export class CookiesController {
    constructor(private readonly cookiesService: CookiesService) {}

    @Post()
    @UseGuards(BodyGuard)
    getCookies(@Body('uuid') uuid: string) {
        return this.cookiesService.getCookies(uuid);
    }
}
