import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { YearModule } from './year/year.module';
import { SubjectModule } from './subject/subject.module';
import { CourseModule } from './course/course.module';
import { CourseSubjectModule } from './course-subject/course-subject.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UserModule, YearModule, CourseModule, SubjectModule, CourseSubjectModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
