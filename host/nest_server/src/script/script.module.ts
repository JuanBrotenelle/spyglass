import { Module } from '@nestjs/common';
import { ScriptService } from './script.service';
import { ScriptController } from './script.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Script, ScriptSchema } from 'src/models/script.model';
import { JwtCustomModule } from 'src/jwt/authjwt/jwt.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Script.name, schema: ScriptSchema }]), JwtCustomModule],
  providers: [ScriptService],
  controllers: [ScriptController]
})
export class ScriptModule {}
