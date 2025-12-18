import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { CourseSubjectService } from './course-subject.service';
import { Auth } from 'decorators/auth.decorator';
import { UserRole } from 'generated/prisma/enums';
import {
  CreateCourseSubjectDto,
  createCourseSubjectSchema,
  UpdateCourseSubjectDto,
  updateCourseSubjectSchema,
} from './schemas';
import { ZodValidationPipe } from 'pipes/zod-validation.pipe';

@Auth(UserRole.ADMIN)
@Controller('course-subject')
export class CourseSubjectController {
  constructor(private courseSubjectService: CourseSubjectService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCourseSubjects(@Query('courseId') courseId?: string) {
    return this.courseSubjectService.getCourseSubjects(courseId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createCourseSubjectSchema))
  async createCourseSubject(@Body() courseSubjectData: CreateCourseSubjectDto) {
    return this.courseSubjectService.createCourseSubject(courseSubjectData);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateCourseSubjectSchema))
  async updateCourseSubject(
    @Body() courseSubjectData: UpdateCourseSubjectDto,
    @Param('id') id: string,
  ) {
    return this.courseSubjectService.updateCourseSubject({
      courseSubjectData,
      id,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteCourseSubject(@Param('id') id: string) {
    return this.courseSubjectService.deleteCourseSubject(id);
  }
}
