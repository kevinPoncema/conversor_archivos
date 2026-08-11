import { z } from 'zod';

const XLSX_OUTPUT_FORMATS = ['csv', 'json', 'xlsx', 'txt'] as const; // Asume formatos comunes

export const ConvertXlsxSchema = z.object({
  outputFormat: z.enum(XLSX_OUTPUT_FORMATS, {
    required_error: 'El formato de salida es requerido',
    invalid_type_error: `El formato debe ser uno de: ${XLSX_OUTPUT_FORMATS.join(', ')}`,
  }),
});

export type ConvertXlsxDto = z.infer<typeof ConvertXlsxSchema>;
