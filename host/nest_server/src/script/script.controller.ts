import { Controller, Get, Post, UseGuards, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ScriptService } from './script.service';
import { BodyGuard } from 'src/jwt/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';

@Controller('api/v1/scripts')
export class ScriptController {
    constructor(private readonly scriptService: ScriptService) {}

    @Get('getall')
    async getAllScripts(): Promise<Array<object>> {
        return await this.scriptService.getAllScripts();
    }

    @Post('getall')
    @UseGuards(BodyGuard)
    async getAllScriptsAdmin(): Promise<Array<object>> {
        return await this.scriptService.getAllScriptsAdmin();
    }

    @Post('add')
    @UseGuards(BodyGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './scripts',
            filename: (req, file, cb) => {
                const uniqueName = `${uuidv4()}${extname(file.originalname) || '.js'}`;
                cb(null, uniqueName);
            },
        }),
    }))
    async addScript(
        @Body('domain') domain: string,
        @Body('color') color: string,
        @UploadedFile() file: Express.Multer.File
    ): Promise<Array<object>> {
        const fileName = file ? file.filename : `${uuidv4()}.js`;
        return await this.scriptService.addScript(domain, fileName, color);
    }

    @Post('delete')
    @UseGuards(BodyGuard)
    async deleteScript(@Body('uuidFile') uuidFile: string): Promise<Array<object>> {
        return await this.scriptService.deleteScript(uuidFile);
    }

    @Post('update')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './scripts',
            filename: async (req, file, cb) => {
                try {
                    const script = file.fieldname;
                    const existingFileName = script || `${uuidv4()}.js`;
                    cb(null, existingFileName);
                } catch (error) {
                    cb(error, null);
                }
            }
        }),
    }))
    @UseGuards(BodyGuard)
    async updateScript(
        @Body('uuidFile') uuidFile: string,
        @Body('domain') domain: string,
        @Body('color') color: string,
        @UploadedFile() file: Express.Multer.File
    ): Promise<Array<object>> {
        return await this.scriptService.updateScript(uuidFile, domain, file, color);
    }
}
