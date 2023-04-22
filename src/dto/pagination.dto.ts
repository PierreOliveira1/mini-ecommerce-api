import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const PaginationSchema = z.object({
  page: z
    .preprocess((value: string) => Number(value), z.number().min(0))
    .optional(),
  limit: z
    .preprocess((value: string) => Number(value), z.number().min(1).max(100))
    .optional(),
});

export class PaginationDto extends createZodDto(PaginationSchema) {}
