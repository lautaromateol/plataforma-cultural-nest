import z from 'zod';

export const createSubjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  yearId: z.string(),
});

export const updateSubjectSchema =createSubjectSchema.partial()

export type CreateSubjectDto = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectDto = z.infer<typeof updateSubjectSchema>;