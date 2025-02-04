import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../models/user.model';

interface FindUsersParams {
  quantity: number;
  sort: string;
  order: number;
  status?: string;
  strict: number;
  search?: string;
}

@Injectable()
export class updateCommentService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async updateComment(uuid: string, comment: string): Promise<Object> {
    console.log(uuid, comment);
    
    const user = await this.userModel.findOne({ uuid });
    if (!user) {
      throw new Error('User not found');
    }
    user.otherInfo.Comment = comment;
    await user.save();
    return ({ message: "OK"});
  }

  async updateTag(uuid: string, tag: "active" | "archive"): Promise<Object> {
    const user = await this.userModel.findOne({ uuid });
    if (!user) {
      throw new Error('User not found');
    }
    user.otherInfo.Activity = tag;
    await user.save();
    return ({ message: "OK"});
  }
}
