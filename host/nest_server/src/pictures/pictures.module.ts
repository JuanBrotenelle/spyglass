import { Module } from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { PicturesController } from './pictures.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Image, ImageSchema } from 'src/models/images.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }])],
  providers: [PicturesService],
  controllers: [PicturesController]
})
export class PicturesModule {}
