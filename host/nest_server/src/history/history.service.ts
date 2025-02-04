import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { History, HistoryDocument } from '../models/history.model';
import { Model } from 'mongoose';

interface FindHistoryParams {
    uuid: string
}

@Injectable()
export class HistoryService {
    constructor(@InjectModel(History.name) private historyModel: Model<HistoryDocument>) {}

    async getHistory(uuid: string): Promise<any> {
        const historyDocument = await this.historyModel.findOne({ uuid }).exec();

        if (historyDocument && historyDocument.history) {
            historyDocument.history = historyDocument.history.slice(0, 20);
        }

        return historyDocument.history;
    }

    async downloadHistory(uuid: string): Promise<Array<object>> {
        return (await this.historyModel.findOne({ uuid: uuid }).exec()).history;
    }
}
