import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { History, HistorySchema } from '../models/history.model';
import {JwtCustomModule} from "../jwt/authjwt/jwt.module";

@Module({
  imports: [MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }]), JwtCustomModule],
  providers: [HistoryService],
  controllers: [HistoryController],
  exports: [HistoryService],
})
export class HistoryModule {}
