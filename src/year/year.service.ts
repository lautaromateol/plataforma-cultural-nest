import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateYearDto, UpdateYearDto } from './schemas';

@Injectable()
export class YearService {
  constructor(private prisma: PrismaService) {}

  async getYears() {
    return await this.prisma.year.findMany();
  }

  async getYear(id: string) {
    const dbYear = await this.prisma.year.findUnique({
      where: {
        id,
      },
    });

    if (!dbYear) {
      throw new NotFoundException('No se encontró un año con este ID.');
    }

    return dbYear;
  }

  async createYear(yearData: CreateYearDto) {
    const dbYear = await this.prisma.year.create({
      data: {
        ...yearData,
      },
    });

    if (!dbYear) {
      throw new InternalServerErrorException(
        'Hubo un error al intentar crear el año. Intenta de nuevo mas tarde.',
      );
    }

    return dbYear;
  }

  async updateYear({ yearData, id }: { yearData: UpdateYearDto; id: string }) {
    const dbYear = await this.prisma.year.update({
      where: {
        id,
      },
      data: {
        ...yearData,
      },
    });

    if (!dbYear) {
      throw new InternalServerErrorException(
        'Hubo un error al intentar actualizar el año. Intenta de nuevo mas tarde.',
      );
    }

    return dbYear;
  }

  async deleteYear(id: string) {
    const dbYear = await this.prisma.year.delete({
      where: {
        id,
      },
    });

    if (!dbYear) {
      throw new InternalServerErrorException(
        'Hubo un error al intentar eliminar el año. Intenta de nuevo mas tarde.',
      );
    }

    return dbYear;
  }
}
