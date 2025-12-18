import {
  BadRequestException,
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
    return await this.prisma.year.findMany({
      orderBy: { level: 'asc' },
    });
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
    try {
      const existingYear = await this.prisma.year.findFirst({
        where: {
          OR: [{ level: yearData.level }, { name: yearData.name }],
        },
      });

      if (existingYear) {
        throw new BadRequestException(
          'Ya existe un año con ese nivel o nombre.',
        );
      }

      const dbYear = await this.prisma.year.create({
        data: {
          ...yearData,
        },
      });

      return { dbYear, message: 'Año creado exitosamente.' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo un error al intentar crear el año. Intenta de nuevo mas tarde.',
      );
    }
  }

  async updateYear({ yearData, id }: { yearData: UpdateYearDto; id: string }) {
    try {
      const dbYear = await this.prisma.year.update({
        where: {
          id,
        },
        data: {
          ...yearData,
        },
      });

      return { dbYear, message: 'Año actualizado exitosamente.' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo un error al intentar actualizar el año. Intenta de nuevo mas tarde.',
      );
    }
  }

  async deleteYear(id: string) {
    try {
      const dbYear = await this.prisma.year.delete({
        where: {
          id,
        },
      });

      return { dbYear, message: 'Año eliminado exitosamente.' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo un error al intentar eliminar el año. Intenta de nuevo mas tarde.',
      );
    }
  }
}
