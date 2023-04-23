import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const AuthSchema = z.object({
  email: z
    .string()
    .email({ message: 'Email inválido' })
    .max(50, { message: 'Email deve ter no máximo 50 caracteres' }),
  password: z
    .string()
    .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
    .max(20, { message: 'Senha deve ter no máximo 20 caracteres' }),
});

export class AuthAdminDto extends createZodDto(AuthSchema) {}
