import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './schemas';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async getCourses({
    academicYear,
    yearId,
  }: {
    academicYear?: number;
    yearId?: string;
  }) {
    const where: any = {};
    if (academicYear) where.academicYear = academicYear;

    if (yearId) where.yearId = yearId;

    const courses = await this.prisma.course.findMany({
      where,
      orderBy: [{ academicYear: 'desc' }, { name: 'asc' }],
    });

    return courses;
  }

  async getCourse(id: string) {
    const course = await this.prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!course) {
      throw new NotFoundException('Curso no encontrado.');
    }

    return course;
  }

  async createCourse(courseData: CreateCourseDto) {
    try {
      const existingCourse = await this.prisma.course.findFirst({
        where: {
          name: courseData.name,
          academicYear: courseData.academicYear,
          yearId: courseData.yearId,
        },
      });

      if (existingCourse) {
        throw new BadRequestException(
          `Ya existe un curso llamado ${courseData.name} en el año academico ${courseData.academicYear} perteneciente a este nivel`,
        );
      }

      const dbCourse = await this.prisma.course.create({
        data: {
          ...courseData,
        },
      });

      return { dbCourse, message: 'Curso creado exitosamente.' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo un error al intentar crear el curso. Intenta de nuevo mas tarde.',
      );
    }
  }

  async updateCourse({
    courseData,
    id,
  }: {
    courseData: UpdateCourseDto;
    id: string;
  }) {
    try {
      const dbCourse = await this.prisma.course.update({
        where: {
          id,
        },
        data: {
          ...courseData,
        },
      });
      return { dbCourse, message: 'Curso actualizado exitosamente.' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo un error al intentar actualizar el curso. Intenta de nuevo mas tarde.',
      );
    }
  }

  async deleteCourse(id: string) {
    try {
      const dbCourse = await this.prisma.course.delete({
        where: {
          id,
        },
      });

      return { dbCourse, message: 'Curso eliminado exitosamente.' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo un error al intentar eliminar el curso. Intenta de nuevo mas tarde.',
      );
    }
  }
}
