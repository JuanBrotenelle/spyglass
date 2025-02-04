import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { UsersModule } from './panel/users/users.module';
import { AuthModule } from './panel/auth/auth.module';
import { CommentModule } from './panel/comment/comment.module';
import { HistoryModule } from './history/history.module';
import { StatsController } from './stats/stats.controller';
import { StatsModule } from './stats/stats.module';
import { JwtCustomModule } from './jwt/authjwt/jwt.module';
import { CookiesController } from './cookies/cookies.controller';
import { CookiesService } from './cookies/cookies.service';
import { CookiesModule } from './cookies/cookies.module';
import { QueueModule } from './queue/queue.module';
import { PicturesModule } from './pictures/pictures.module';
import { ScriptModule } from './script/script.module';

config();

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO), UsersModule, AuthModule, CommentModule, HistoryModule, StatsModule, JwtCustomModule, CookiesModule, QueueModule, PicturesModule, ScriptModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
