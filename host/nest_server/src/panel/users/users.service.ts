import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../models/user.model';
import { Status } from '../../models/status.model';
import { StatusDocument } from '../../models/status.model';

interface FindUsersParams {
  quantity: number;
  sort: string;
  order: number;
  status?: string;
  strict: number;
  search?: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, @InjectModel(Status.name) private statusModel: Model<StatusDocument>,) {}

  async findUsers(params: FindUsersParams): Promise<User[]> {
    const { quantity, sort, order, strict, search } = params;
  
    const filter: any = {
      'otherInfo.Activity': { $ne: 'deleted' },
    };

    if (Number(strict) === 0 && search) {
      filter.$text = { $search: search };
    }
  
    const sortOptions: any = {};
    if (sort === 'none') {
      // Без сортировки
    } else if (sort === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filter['otherInfo.Created_at'] = { $gte: today };
      sortOptions['otherInfo.Created_at'] = Number(order) === -1 ? -1 : 1;
    } else if (sort === 'active' || sort === 'archive') {
      filter['otherInfo.Activity'] = sort === 'active' ? 'active' : 'archive';
      sortOptions['otherInfo.Activity'] = Number(order) === -1 ? -1 : 1;
    } 

    const statusCondition = sort === 'online' ? 'online' 
                     : sort === 'offline' ? 'offline' 
                     : { $ne: null };
    
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'histories',
          localField: 'uuid',
          foreignField: 'uuid',
          as: 'historyData',
        },
      },
      {
        $addFields: {
          historyLength: { $size: { $ifNull: [{ $arrayElemAt: ['$historyData.history', 0] }, []] } },
        },
      },
      {
        $lookup: {
          from: 'cookies',
          localField: 'uuid',
          foreignField: 'uuid',
          as: 'cookieData',
        },
      },
      {
        $addFields: {
          cookieLength: { $size: { $ifNull: [{ $arrayElemAt: ['$cookieData.body', 0] }, []] } },
        },
      },
      {
        $lookup: {
          from: 'currentstatuses',
          localField: 'uuid',
          foreignField: 'uuid',
          as: 'statusData',
        },
      },
      {
        $addFields: {
          status: { $arrayElemAt: ['$statusData.currentStatus', 0] },
          lastOnline: { $arrayElemAt: ['$statusData.lastOnline', 0] },
        },
      },
      {
        $match: {
          status: statusCondition,
        },
      },
      {
        $lookup: {
          from: 'images',
          localField: 'uuid',
          foreignField: 'uuid',
          as: 'imageData',
        },
      },
      {
        $addFields: {
          images: { $arrayElemAt: ['$imageData.src', 0] },
        },
      },
      ...(Object.keys(sortOptions).length > 0 ? [{ $sort: sortOptions }] : []),
      ...(Number(quantity) > 0 ? [{ $limit: Number(quantity) }] : []),
      { $project: { historyData: 0, cookieData: 0, statusData: 0 } },
    ];
  
    return this.userModel.aggregate(pipeline).exec();
  }

  checkToken(): Object {
    return {
      status: 200,
      message: 'OK',}
  }

  async deleteUser(uuid: string): Promise<Object> {
    const user = await this.userModel.findOne({ uuid });
    const status = await this.statusModel.findOne({ uuid });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (!status) {
      throw new Error('Status not found');
    }
    
    status.currentStatus = 'deleted';
    await status.save();
    user.otherInfo.Activity = 'deleted';
    await user.save();

    return { message: 'OK' };
  }
}
