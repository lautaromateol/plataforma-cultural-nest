import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseSubjectDto, UpdateCourseSubjectDto } from './schemas';

@Injectable()
export class CourseSubjectService {
  constructor(private prisma: PrismaService) {}

  async getCourseSubjects(courseId?: string) {
    const where: any = {};
    if (courseId) where.courseId = courseId;

    const courseSubjects = await this.prisma.courseSubject.findMany({
      where,
      include: {
        course: {
          include: {
            year: true,
          },
        },
        subject: true,
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return courseSubjects;
  }

  async createCourseSubject(courseSubjectData: CreateCourseSubjectDto) {
    const { courseId, subjectId, teacherId, schedule } = courseSubjectData;

    try {
      if (teacherId) {
        const teacher = await this.prisma.user.findUnique({
          where: {
            id: teacherId,
          },
        });

        if (teacher?.role !== 'TEACHER') {
          throw new BadRequestException(
            'El usuario seleccionado no es un profesor.',
          );
        }
      }

      const courseSubject = await this.prisma.courseSubject.upsert({
        where: {
          courseId_subjectId: {
            courseId,
            subjectId,
          },
        },
        update: {
          teacherId: teacherId || null,
          schedule: schedule || null,
        },
        create: {
          ...courseSubjectData,
        },
        include: {
          course: true,
          subject: true,
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      const isNew =
        courseSubject.createdAt.getTime() === courseSubject.updatedAt.getTime();

      const message = isNew
        ? 'Profesor asignado a la materia exitosamente.'
        : 'Asignación de profesor actualizada exitosamente.';

      return {
        courseSubject,
        message,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Hubo un error al asignar un prosefor a la materia. Intenta de nuevo mas tarde.',
      );
    }
  }

  async updateCourseSubject({
    courseSubjectData,
    id,
  }: {
    courseSubjectData: UpdateCourseSubjectDto;
    id: string;
  }) {
    try {
      const dbCourseSubject = await this.prisma.courseSubject.update({
        where: {
          id,
        },
        data: {
          ...courseSubjectData,
        },
        include: {
          course: true,
          subject: true,
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return {
        dbCourseSubject,
        message: 'Asignación actualizada exitosamente.',
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Hubo un error al intentar actualizar la asignación. Intenta de nuevo mas tarde.',
      );
    }
  }

  async deleteCourseSubject(id: string) {
    try {
      const dbCourseSubject = await this.prisma.courseSubject.delete({
        where: {
          id,
        },
      });

      return { dbCourseSubject, message: 'Asignación eliminada exitosamente.' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo un error al intentar eliminar la asignación. Intenta de nuevo mas tarde.',
      );
    }
  }
}
