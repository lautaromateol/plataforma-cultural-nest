import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async enrollStudent({
    courseId,
    studentId,
  }: {
    courseId: string;
    studentId: string;
  }) {
    try {
      const student = await this.prisma.user.findUnique({
        where: {
          id: studentId,
        },
      });

      if (!student) {
        throw new BadRequestException('El ID de estudiante es invalido.');
      }

      if (student.role !== 'STUDENT') {
        throw new BadRequestException('El usuario no es un alumno.');
      }

      const course = await this.prisma.course.findUnique({
        where: {
          id: courseId,
        },
        include: {
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
      });

      if (!course) {
        throw new BadRequestException('El ID de curso es invalido.');
      }

      if (course._count.enrollments >= course.capacity) {
        throw new BadRequestException(
          'El curso ya ha llegado a su limite de capacidad.',
        );
      }

      const existingEnrollment = await this.prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId,
            courseId,
          },
        },
      });

      if (existingEnrollment) {
        throw new BadRequestException(
          'Este estudiante ya se encuentra matriculado en el curso.',
        );
      }

      const dbEnrollment = await this.prisma.enrollment.create({
        data: {
          courseId,
          studentId,
        },
      });

      return {
        dbEnrollment,
        message: 'Estudiante matriculado exitosamente.',
      };
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(
        'Hubo un error al matricular al estudiante.',
      );
    }
  }

  async deleteEnrollment({ courseId, studentId }:{ courseId: string, studentId: string }) {
    try {
      const existingEnrollment = await this.prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId,
            courseId
          }
        }
      })

      if(existingEnrollment) {
        throw new BadRequestException("No existe la matricula que se desea eliminar.")
      }

      const dbEnrollment = await this.prisma.enrollment.delete({
        where: {
          studentId_courseId: {
            studentId,
            courseId
          }
        }
      })

      return {
        dbEnrollment, 
        message: "Matricula eliminada exitosamente."
      }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException("Hubo un error al intentar eliminar la matricula. Intentalo de nuevo mas tarde.")
    }
  }
}
