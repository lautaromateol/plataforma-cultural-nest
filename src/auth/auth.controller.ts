import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateEmailSchema, LoginSchema, ResendEmailSchema } from './schemas';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async login(
    @Body() userData: LoginSchema,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token, role } = await this.authService.login(userData);

    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      ok: true,
      role,
    };
  }

  @Patch('create-email')
  @HttpCode(HttpStatus.OK)
  async createEmail(@Body() userData: CreateEmailSchema) {
    return await this.authService.createEmail(userData);
  }

  @Patch('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Query() verificationToken: string) {
    return await this.authService.verifyEmail(verificationToken);
  }

  @Patch('resend-email')
  @HttpCode(HttpStatus.OK)
  async resendEmail(@Body() userData: ResendEmailSchema) {
    return await this.authService.resendEmail(userData);
  }

  @Delete('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');

    return { ok: true };
  }
}
