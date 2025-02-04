import { Controller, Sse, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/jwt/stream.guard';
import { StatsService } from './stats.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('api/v1/stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) {}

    @Sse('stream')
    @UseGuards(AuthGuard)
    getStats(): Observable<any> {
        return this.statsService.getStats().pipe(
            map(data => ({ data }))
        );
    }
}
