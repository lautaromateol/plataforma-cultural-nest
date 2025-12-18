import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { CourseSubjectService } from "./course-subject.service";
import { CourseSubjectController } from "./course-subject.controller";

@Module({
  imports: [PrismaModule],
  providers: [CourseSubjectService],
  controllers: [CourseSubjectController]
})
export class CourseSubjectModule {}