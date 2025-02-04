import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    NestJwtModule.register({
      secret: 'gNKM89wPMBEx7BSK',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  exports: [NestJwtModule],
})
export class JwtCustomModule {}
