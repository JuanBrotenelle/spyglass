import { Module } from '@nestjs/common';
import { updateCommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../models/user.model';
import {JwtCustomModule} from "../../jwt/authjwt/jwt.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), JwtCustomModule
  ],
  controllers: [CommentController],
  providers: [updateCommentService],
  exports: [updateCommentService],
})
export class CommentModule {}
