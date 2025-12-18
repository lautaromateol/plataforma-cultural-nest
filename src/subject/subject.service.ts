import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubjectDto, UpdateSubjectDto } from './schemas';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async getSubjects({ yearId }: { yearId: string }) {
    const where: any = {};
    if (yearId) where.yearId = yearId;

    const subjects = await this.prisma.subject.findMany({
      where,
      include: {
        year: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return subjects;
  }

  async getSubject(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: {
        id,
      },
    });

    if (!subject) {
      throw new NotFoundException('Materia no encontrada.');
    }

    return subject;
  }

  async createSubject(subjectData: CreateSubjectDto) {
    const year = await this.prisma.year.findUnique({
      where: {
        id: subjectData.yearId,
      },
    });

    if (!year) {
      throw new NotFoundException(
        'No se encontró un año con el ID proporcionado.',
      );
    }

    const code = `${subjectData.name.slice(0, 3).toUpperCase()}-${year.level}`;

    const subject = await this.prisma.subject.create({
      data: {
        ...subjectData,
        yearId: year.id,
        code,
      },
    });

    if (!subject) {
      throw new InternalServerErrorException(
        'Hubo un error al crear la materia. Intenta de nuevo mas tarde',
      );
    }
  }

  async updateSubject({
    subjectData,
    id,
  }: {
    subjectData: UpdateSubjectDto;
    id: string;
  }) {
    const dbSubject = await this.prisma.subject.update({
      where: {
        id,
      },
      data: {
        ...subjectData,
      },
    });

    if (!dbSubject) {
      throw new InternalServerErrorException(
        'Hubo un error al intentar actualizar la materia. Intenta de nuevo mas tarde.',
      );
    }

    return dbSubject;
  }

  async deleteSubject(id: string) {
    const dbSubject = await this.prisma.subject.delete({
      where: {
        id,
      },
    });

    if (!dbSubject) {
      throw new InternalServerErrorException(
        'Hubo un error al intentar eliminar la materia. Intenta de nuevo mas tarde.',
      );
    }

    return dbSubject;
  }
}
