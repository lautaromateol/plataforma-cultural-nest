import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Auth } from 'decorators/auth.decorator';
import { UserRole } from 'generated/prisma/enums';
import { CourseService } from './course.service';
import { ZodValidationPipe } from 'pipes/zod-validation.pipe';
import {
  CreateCourseDto,
  createCourseSchema,
  UpdateCourseDto,
  updateCourseSchema,
} from 'src/course/schemas';

@Auth(UserRole.ADMIN)
@Controller('course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCourses(@Query("academicYear", ParseIntPipe) academicYear: number, @Query("yearId") yearId: string) {
    return await this.courseService.getCourses({ academicYear, yearId });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getCourse(@Param("id") id: string) {
    return await this.courseService.getCourse(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createCourseSchema))
  async createCourse(@Body() courseData: CreateCourseDto) {
    return await this.courseService.createCourse(courseData);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateCourseSchema))
  async updateCourse(@Param("id") id: string, @Body() courseData: UpdateCourseDto) {
    return await this.courseService.updateCourse({ id, courseData });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteCourse(@Param("id") id: string) {
    return await this.courseService.deleteCourse(id);
  }
}
