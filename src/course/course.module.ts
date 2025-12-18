import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';

@Module({
  imports: [PrismaModule],
  providers: [CourseService],
  controllers: [CourseController],
})
export class CourseModule {}
