import { z } from 'zod';

const HTML_MD_FORMATS = ['html', 'md'] as const;

export const ConvertHtmlMdSchema = z.object({
  outputFormat: z.enum(HTML_MD_FORMATS, {
    required_error: 'El formato de salida es requerido',
    invalid_type_error: `El formato debe ser uno de: ${HTML_MD_FORMATS.join(', ')}`,
  }),
});

export type ConvertHtmlMdDto = z.infer<typeof ConvertHtmlMdSchema>;
