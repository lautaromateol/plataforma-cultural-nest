import z from "zod";

export const createCourseSubjectSchema = z.object({
  courseId: z.string(),
  subjectId: z.string(),
  teacherId: z.string().optional(),
  schedule: z.string().optional()
})

export const updateCourseSubjectSchema = createCourseSubjectSchema.partial()

export type CreateCourseSubjectDto = z.infer<typeof createCourseSubjectSchema>
export type UpdateCourseSubjectDto = z.infer<typeof updateCourseSubjectSchema>