import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { EnrollmentService } from "./enrollment.service";
import { EnrollmentController } from "./enrollment.controller";

@Module({
  imports: [PrismaModule],
  providers: [EnrollmentService],
  controllers: [EnrollmentController]
})
export class EnrollmentModule {}