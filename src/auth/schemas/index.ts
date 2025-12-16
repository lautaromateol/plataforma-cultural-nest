import { User } from 'generated/prisma/client';
import z from 'zod';

const loginSchema = z
  .object({
    email: z.email().optional(),
    dni: z
      .string()
      .min(8, { message: 'DNI invalido.' })
      .max(8, { message: 'DNI invalido' })
      .optional(),
    password: z
      .string()
      .min(8, {
        message:
          'La contraseña debe tener un minimo de 8 caracteres y un maximo de 20',
      })
      .max(20, {
        message:
          'La contraseña debe tener un minimo de 8 caracteres y un maximo de 20',
      }),
  })
  .refine((data) => (data.email ? !data.dni : data.dni), {
    path: ['email', 'dni'],
    message: 'Debes ingresar **solo** email o **solo** DNI para autenticarte',
  });

  export type LoginSchema = z.infer<typeof loginSchema>
  export type CreateEmailSchema = Required<LoginSchema>
  export type UpdateUserSchema = Partial<Omit<User, "createdAt" | "updatedAt" | "id">>
  export type ResendEmailSchema = Omit<LoginSchema, "password">