import { z } from 'zod';

export const ConvertImageSchema = z.object({
  outputFormat: z.enum(['jpg', 'jpeg', 'png', 'webp', 'tiff']),
});

export type ConvertImageDto = z.infer<typeof ConvertImageSchema>;
