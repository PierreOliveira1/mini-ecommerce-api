import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreateProductSchema = z.object({
  name: z.string().min(3).max(50),
  price: z.number().min(0).max(1000000),
  stock: z.number().min(0).max(1000000),
  image: z
    .string()
    .refine(
      (value) => {
        return /^data:image\/(jpeg|png|gif);base64,/.test(value);
      },
      { message: 'O arquivo deve ser uma imagem' },
    )
    .refine(
      (value) => {
        return Buffer.byteLength(value, 'base64') <= 1024 * 1024 * 5;
      },
      { message: 'A foto deve ter no máximo 5MB' },
    ),
});

export class CreateProductDto extends createZodDto(CreateProductSchema) {}
