import { Controller, Delete, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { EnrollmentService } from "./enrollment.service";

@Controller("enrollment")
export class EnrollmentController {
  constructor(private enrollmentService: EnrollmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async enrollStudent(
    @Query("studentId") studentId: string,
    @Query("courseId") courseId: string
  ) {
    return await this.enrollmentService.enrollStudent({ studentId, courseId })
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteEnrollment(
    @Query("studentId") studentId: string,
    @Query("courseId") courseId: string 
  ) {
    return await this.enrollmentService.deleteEnrollment({ studentId, courseId })
  }
}