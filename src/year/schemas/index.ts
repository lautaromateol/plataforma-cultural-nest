import z from 'zod';

export const createYearSchema = z.object({
  level: z
    .int()
    .min(1, { message: 'El nivel minimo es 1.' })
    .max(6, { message: 'El nivel maximo es 6.' }),
  name: z.string(),
  description: z.string().optional()
});

export const updateYearSchema = createYearSchema.partial()

export type CreateYearDto = z.infer<typeof createYearSchema>
export type UpdateYearDto = z.infer<typeof updateYearSchema>