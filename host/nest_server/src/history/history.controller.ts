import { Controller, Get, Post, Query, UseGuards, Body } from '@nestjs/common';
import { HistoryService } from './history.service';
import { BodyGuard } from 'src/jwt/jwt.guard';

@Controller('api/v1/history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) {}

    @Get()
    @UseGuards(BodyGuard)
    async getHistory(@Query('uuid') uuid: string) {
        return this.historyService.getHistory(uuid);
    }

    @Post()
    @UseGuards(BodyGuard)
    async downloadHistory(@Body('uuid') uuid: string) {
        return this.historyService.downloadHistory(uuid);
    }
}
