import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Script, ScriptDocument } from 'src/models/script.model';
import { join } from 'path';
import { unlink, rename, readFile, writeFile } from 'fs/promises';

@Injectable()
export class ScriptService {
    constructor(@InjectModel(Script.name) private readonly scriptModel: Model<ScriptDocument>) {}

    async getAllScripts(): Promise<Array<object>> {
        return (await this.scriptModel.find().exec()).map(script => {
            return { domain: script.domain, file: script.file, color: script.color };
        });
    }

    async getAllScriptsAdmin(): Promise<Script[]> {
        return await this.scriptModel.find().exec();
    }

    async addScript(domain: string, fileName: string, color: string): Promise<Array<object>> {
        const script = new this.scriptModel({
            uuidFile: fileName,
            domain: domain,
            file: fileName,
            color: color,
            created_at: new Date()
        }); 
        await script.save();
        return await this.getAllScriptsAdmin();
    }

    async deleteScript(uuidFile: string): Promise<Array<object>> {
        const script = await this.scriptModel.findOneAndDelete({ uuidFile });
        if (script) {
            const filePath = join(process.cwd(), 'scripts', script.file);
            await unlink(filePath).catch(err => console.error(`Error deleting file: ${err}`));
        }
        return await this.getAllScriptsAdmin();
    }

    async updateScript(uuidFile: string, domain: string, file: Express.Multer.File, color: string): Promise<Array<object>> {
        const script = await this.scriptModel.findOne({ uuidFile });
        if (script) {
            const filePath = join(process.cwd(), 'scripts', script.file);
            let fileChanged = false;
            let domainChanged = false;
            let colorChanged = false;
            if (file) {
                const existingFileContent = await readFile(filePath, 'utf-8');
                const newFileContent = (await readFile(file.path)).toString();
                if (existingFileContent !== newFileContent) {
                    await writeFile(filePath, newFileContent, 'utf-8');
                    fileChanged = true;
                }
            }
            if (script.domain !== domain) {
                script.domain = domain;
                domainChanged = true;
            }

            if (script.color !== color) {
                script.color = color;
                colorChanged = true;
            }

            if (fileChanged || domainChanged || colorChanged) {
                await script.save();
            }
        }
        return await this.getAllScriptsAdmin();
    }
}
