import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.model';
import { Status, StatusDocument } from '../models/status.model';
import { Observable, interval } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class StatsService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Status.name) private statusModel: Model<StatusDocument>,
    ) {}

    getStats(): Observable<any> {
        return interval(2000).pipe(
            mergeMap(async () => {
                const totalUsers = await this.userModel.countDocuments({ 'otherInfo.Activity': { $ne: 'deleted' } });
                const onlineUsers = await this.statusModel.countDocuments({ currentStatus: 'online' });
                const offlineUsers = await this.statusModel.countDocuments({ currentStatus: 'offline' });
                const todayUsers = await this.userModel.countDocuments({
                    'otherInfo.Created_at': { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
                });
                const activeUsers = await this.userModel.countDocuments({
                    'otherInfo.Activity': 'active' });
                const archiveUsers = await this.userModel.countDocuments({
                    'otherInfo.Activity': 'archive'
                })

                return [
                    { title: 'Всего пользователей', quantity: totalUsers },
                    { title: 'Онлайн', quantity: onlineUsers },
                    { title: 'Оффлайн', quantity: offlineUsers },
                    { title: 'Сегодня', quantity: todayUsers },
                    { title: 'Активные', quantity: activeUsers },
                    { title: 'Архив', quantity: archiveUsers },
                ];
            })
        );
    }
}
