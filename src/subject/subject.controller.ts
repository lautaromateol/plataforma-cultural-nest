import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Auth } from 'decorators/auth.decorator';
import { UserRole } from 'generated/prisma/enums';
import { SubjectService } from './subject.service';
import { ZodValidationPipe } from 'pipes/zod-validation.pipe';
import {
  CreateSubjectDto,
  createSubjectSchema,
  UpdateSubjectDto,
  updateSubjectSchema,
} from 'src/subject/schemas';

@Auth(UserRole.ADMIN)
@Controller('subject')
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getSubjects(@Query("yearId") yearId: string) {
    return await this.subjectService.getSubjects({ yearId });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getSubject(@Param("id") id: string) {
    return await this.subjectService.getSubject(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createSubjectSchema))
  async createSubject(@Body() subjectData: CreateSubjectDto) {
    return await this.subjectService.createSubject(subjectData);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateSubjectSchema))
  async updateSubject(@Param("id") id: string, @Body() subjectData: UpdateSubjectDto) {
    return await this.subjectService.updateSubject({ id, subjectData });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteSubject(@Param("id") id: string) {
    return await this.subjectService.deleteSubject(id);
  }
}
