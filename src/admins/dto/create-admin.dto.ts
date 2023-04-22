import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreateAdminSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
    .max(60, { message: 'O nome deve ter no máximo 60 caracteres' }),
  email: z
    .string()
    .email({ message: 'Email inválido' })
    .max(60, { message: 'Email muito longo' }),
  password: z
    .string()
    .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
    .max(20, { message: 'A senha deve ter no máximo 20 caracteres' }),
});

export class CreateAdminDto extends createZodDto(CreateAdminSchema) {}
