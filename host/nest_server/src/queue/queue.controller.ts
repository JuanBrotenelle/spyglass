import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BodyGuard } from 'src/jwt/jwt.guard';

interface uuid {
    uuid: string;
}
@Controller('queue')
export class QueueController {
    constructor(private readonly queueService: QueueService) {}

    @Post()
    @UseGuards(BodyGuard)
    async addQueue(@Body() uuid: uuid): Promise<any> {
        return await this.queueService.addQueue(uuid.uuid);
    }
}
