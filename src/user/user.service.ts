import { Injectable } from '@nestjs/common';
import { UpdateUserSchema } from 'src/auth/schemas';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserByID({ id }: { id: string }) {
    const dbUser = await this.prisma.user.findUnique({
      where: { id },
    });

    return dbUser;
  }

  async getUserByDNI({ dni }: { dni: string }) {
    const dbUser = await this.prisma.user.findUnique({
      where: { dni },
    });

    return dbUser;
  }

  async getUserByEmail({ email }: { email: string }) {
    const dbUser = await this.prisma.user.findUnique({
      where: { email },
    });

    return dbUser;
  }

  async getUserByToken({ verificationToken }: { verificationToken: string }) {
    const dbUser = await this.prisma.user.findUnique({
      where: { verificationToken },
    });

    return dbUser;
  }

  async updateUser({
    userData,
    id,
  }: {
    userData: UpdateUserSchema;
    id: string;
  }) {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
      },
    });

    return updatedUser;
  }

   async updateUserByDNI({
    userData,
    dni,
  }: {
    userData: UpdateUserSchema;
    dni: string;
  }) {
    const updatedUser = await this.prisma.user.update({
      where: { dni },
      data: {
        ...userData,
      },
    });

    return updatedUser;
  }
}
