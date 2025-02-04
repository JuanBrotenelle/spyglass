import { Controller, Post, UploadedFile, Body, UseInterceptors } from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('pictures')
export class PicturesController {
    constructor(private readonly picturesService: PicturesService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = `${file.originalname}-${Date.now()}${path.extname(file.originalname)}`;
                cb(null, uniqueSuffix);
            }
        })
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('uuid') uuid: string) {
        console.log("Someone trying to upload a file");
        return this.picturesService.uploadFile(file, uuid);
    }
}
