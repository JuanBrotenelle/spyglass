import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { updateCommentService } from './comment.service';
import { User } from '../../models/user.model';
import { BodyGuard } from '../../jwt/jwt.guard';

interface UpdateCommentDto {
    uuid: string;
    comment: string;
  }

interface UpdateTagDto {
    uuid: string;
    tag: "active" | "archive";
}

@Controller('api/v1/comment')
export class CommentController {
  constructor(private readonly updateCommentService: updateCommentService) {}
  

  @Post()
  @UseGuards(BodyGuard)
  async updComment(@Body() body: UpdateCommentDto): Promise<Object | { error: string }> {
    try {
      const { uuid, comment } = body;
      return this.updateCommentService.updateComment(uuid, comment);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('tag')
  @UseGuards(BodyGuard)
  async updTag(@Body() body: UpdateTagDto): Promise<Object | { error: string }> {
    try {
      const { uuid, tag } = body;
      return this.updateCommentService.updateTag(uuid, tag);
    } catch (error) {
      return { error: error.message };
    }
  }
}
