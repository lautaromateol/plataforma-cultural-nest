import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateEmailSchema, LoginSchema, ResendEmailSchema } from './schemas';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() userData: LoginSchema) {
    return await this.authService.login(userData);
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
}
