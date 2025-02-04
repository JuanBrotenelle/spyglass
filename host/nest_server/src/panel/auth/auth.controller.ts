import { Controller, Post, HttpCode, HttpStatus, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestBody, RequestBodyChangePassword } from './request-body.interface';
import { BodyGuard } from 'src/jwt/jwt.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: RequestBody): Promise<{ access_token: string } | { error: string }> {
    try {
      return await this.authService.login(body);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('changepassword')
  @UseGuards(BodyGuard)
  async changePassword(@Body() body: RequestBodyChangePassword): Promise<{ access_token: string } | { error: string }> {
    try {
      return await this.authService.changePassword(body);
    } catch (error) {
      return { error: error.message };
    }
  }

}
