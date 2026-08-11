import { z } from 'zod';

export const ConvertXlsxSchema = z.object({
  outputFormat: z.enum(['csv', 'json', 'xlsx', 'txt']),
});

export type ConvertXlsxDto = z.infer<typeof ConvertXlsxSchema>;
