import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { JwtCustomModule } from "../jwt/authjwt/jwt.module";
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user.model';
import { Status, StatusSchema } from '../models/status.model';

@Module({
  controllers: [StatsController],
  exports: [StatsService],
  providers: [StatsService],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), MongooseModule.forFeature([{ name: Status.name, schema: StatusSchema }]), JwtCustomModule],
})
export class StatsModule {}
