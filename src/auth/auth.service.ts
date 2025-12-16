import * as bcrypt from 'bcrypt';
import { Resend } from 'resend';
import { randomBytes } from 'crypto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateEmailSchema, LoginSchema, ResendEmailSchema } from './schemas';
import { createVerificationMail } from 'lib/utils';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(userData: LoginSchema) {
    const { email, dni, password } = userData;

    if (!password) {
      throw new BadRequestException('Por favor, ingresa una contraseña.');
    }

    const dbUser = email
      ? await this.userService.getUserByEmail({ email })
      : dni
        ? await this.userService.getUserByDNI({ dni })
        : null;

    if (!dbUser) {
      throw new UnauthorizedException('Tus credenciales son incorrectas.');
    }

    const isPassword = await bcrypt.compare(password, dbUser.password);

    if (!isPassword) {
      throw new UnauthorizedException('Tus credenciales son incorrectas.');
    }

    if (dbUser.firstLogin && !dbUser.isVerified) {
      throw new HttpException(
        {
          message: 'Debes verificar tu correo electrónico',
          dni: dbUser.dni,
          name: dbUser.name,
          redirect: true,
        },
        HttpStatus.SEE_OTHER,
      );
    }

    if (!dbUser.isVerified) {
      throw new UnauthorizedException(
        `Debes verificar esta dirección de correo electrónico. Verifica la bandeja de entrada de ${dbUser.email}`,
      );
    }

    const payload = {
      sub: dbUser.id,
      dni: dbUser.dni,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      role: dbUser.role,
    };
  }

  async createEmail(userData: CreateEmailSchema) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { dni, email, password } = userData;

    const dbUser = await this.userService.getUserByDNI({ dni });

    if (!dbUser) {
      throw new UnauthorizedException('No existe un usuario con este id.');
    }

    const isPassword = await bcrypt.compare(password, dbUser.password);

    if (!isPassword) {
      throw new UnauthorizedException('Tus credenciales son incorrectas');
    }

    const verificationToken = randomBytes(32).toString('hex');

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verificar?token=${verificationToken}`;

    const updatedUser = await this.userService.updateUserByDNI({
      userData: { email, firstLogin: false, verificationToken },
      dni,
    });

    if (!updatedUser) {
      throw new InternalServerErrorException(
        'Hubo un error para asociar el correo a tu cuenta.',
      );
    }

    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [email],
      subject:
        'Verifica tu correo electrónico para ingresar a la plataforma virtual del Centro Cultural.',
      html: createVerificationMail(verificationUrl),
    });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Hubo un error para asociar el correo a tu cuenta.',
      );
    }

    return {
      message: `Correo enviado a ${updatedUser.email}. Revisa tu casilla para proceder con el registro.`,
    };
  }

  async verifyEmail(verificationToken: string) {
    if (!verificationToken) {
      throw new BadRequestException('Token no proporcionado.');
    }

    const dbUser = await this.userService.getUserByToken({ verificationToken });

    if (!dbUser) {
      throw new BadRequestException(
        'El token que has proporcionado es invalido.',
      );
    }

    const hoursSinceUpdate =
      (new Date().getTime() - new Date(dbUser.updatedAt).getTime()) /
      (1000 * 60 * 60);

    if (hoursSinceUpdate > 24) {
      throw new UnauthorizedException('El token ha expirado.');
    }

    await this.userService.updateUser({
      userData: { isVerified: true, verificationToken: null },
      id: dbUser.id,
    });
  }

  async resendEmail(userData: ResendEmailSchema) {
    const resend = new Resend();

    const { email, dni } = userData;

    const dbUser = email
      ? await this.userService.getUserByEmail({ email })
      : dni
        ? await this.userService.getUserByDNI({ dni })
        : null;

    if (!dbUser || !dbUser.email) {
      throw new NotFoundException(
        'No se encontró un usuario con este email o DNI.',
      );
    }

    const verificationToken = randomBytes(32).toString('hex');

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verificar?token=${verificationToken}`;

    const updatedUser = await this.userService.updateUser({
      userData: { verificationToken },
      id: dbUser.id,
    });

    if (!updatedUser) {
      throw new InternalServerErrorException(
        'Hubo un error para asociar el correo a tu cuenta.',
      );
    }

    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [dbUser.email],
      subject:
        'Verifica tu correo electrónico para ingresar a la plataforma virtual del Centro Cultural.',
      html: createVerificationMail(verificationUrl),
    });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Hubo un error para reenviar el correo.',
      );
    }

    return {
      message: `Correo enviado a ${updatedUser.email}. Revisa tu casilla para proceder con el registro.`,
    };
  }
}
