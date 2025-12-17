import z from "zod";

export const createCourseSchema = z.object({
  name: z.string(),
  academicYear: z.number().min(2000).max(2030),
  capacity: z.number().min(1, { message: "El curso debe tener una capacidad de minimo 1 alumno" }),
  classroom: z.string().optional(),
  yearId: z.string()
})

export const updateCourseSchema = createCourseSchema.partial()

export type CreateCourseDto = z.infer<typeof createCourseSchema>
export type UpdateCourseDto = z.infer<typeof updateCourseSchema>