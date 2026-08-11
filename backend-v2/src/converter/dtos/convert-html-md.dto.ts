import { z } from 'zod';

export const ConvertHtmlMdSchema = z.object({
  outputFormat: z.enum(['html', 'md']),
});

export type ConvertHtmlMdDto = z.infer<typeof ConvertHtmlMdSchema>;
