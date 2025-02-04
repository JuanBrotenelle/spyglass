import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { readFileSync } from 'fs';

const httpsOptions = {
  key: readFileSync(join(__dirname, '..', 'certs', 'privkey.pem')),
  cert: readFileSync(join(__dirname, '..', 'certs', 'fullchain.pem')),
}

try {
  config();
  console.log("Loaded .env file successfully");
} catch (error) {
  console.log("Error while loading .env file: ", error);
}

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: console,
    httpsOptions
  });

  app.enableCors();

  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });
  app.useStaticAssets(join(__dirname, '..', 'scripts'), { prefix: '/scripts' });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
