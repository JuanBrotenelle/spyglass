import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Queue, QueueDocument } from 'src/models/queue.model';

@Injectable()
export class QueueService {

    constructor(@InjectModel(Queue.name) private queueModel: Model<QueueDocument>) {}
    async addQueue(uuid: string): Promise<any> {

        const queue = await this.queueModel.create({
            uuid: uuid,
            status: "pending",
            created_at: new Date()
        });

        return {
            status: 200,
            message: "OK",
            queue: "Have status pending"
        }

    }
}
