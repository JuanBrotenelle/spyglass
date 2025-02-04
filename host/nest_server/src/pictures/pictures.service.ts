import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Image, ImageDocument } from 'src/models/images.model';
import { Model } from 'mongoose';

@Injectable()
export class PicturesService {
    constructor(
        @InjectModel(Image.name) private imageModel: Model<ImageDocument>, // Модель изображения
    ) {}

    async uploadFile(file: Express.Multer.File, uuid: string): Promise<object> {
        console.log(file);
        console.log(uuid);

        try {
            let image = await this.imageModel.findOne({ uuid });

            if (!image) {
                image = new this.imageModel({
                    uuid,
                    src: [],
                    created_at: new Date(),
                });
            }

            const newImagePath = `/uploads/${file.filename}`;
            image.src.push(newImagePath);

            await image.save();

            return { status: 'OK', image: newImagePath };
        } catch (error) {
            console.error('Error during file upload:', error);
            return { status: 'ERROR', message: 'Internal server error' };
        }
    }
}
