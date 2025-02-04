import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { JwtCustomModule } from 'src/jwt/authjwt/jwt.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Queue, QueueSchema } from 'src/models/queue.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Queue.name, schema: QueueSchema }]), JwtCustomModule],
  controllers: [QueueController],
  providers: [QueueService]
})
export class QueueModule {}
