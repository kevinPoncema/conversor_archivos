import { z } from 'zod';

const IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'tiff'] as const;

export const ConvertImageSchema = z.object({
  outputFormat: z.enum(IMAGE_FORMATS, {
    required_error: 'El formato de salida es requerido',
    invalid_type_error: `El formato debe ser uno de: ${IMAGE_FORMATS.join(', ')}`,
  }),
});

export type ConvertImageDto = z.infer<typeof ConvertImageSchema>;
