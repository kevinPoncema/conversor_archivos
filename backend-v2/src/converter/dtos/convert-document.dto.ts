import { z } from 'zod';

const validConversions: Record<string, string[]> = {
  markdown: ["html", "epub", "docx", "pdf", "odt", "rtf", "tex", "plain", "jupyter"],
  html: ["markdown", "pdf", "epub", "docx", "odt", "rtf", "jupyter"],
  epub: ["html", "pdf", "markdown"],
  docx: ["markdown", "html", "pdf", "odt"],
  odt: ["docx", "pdf", "html", "markdown"],
  rtf: ["docx", "pdf", "html"],
  tex: ["pdf", "html"],
  plain: ["markdown"],
  jupyter: ["markdown", "html"],
  pdf: [],
};

export const ConvertDocumentSchema = z
  .object({
    inputFormat: z.string().min(1, 'El formato de entrada es requerido'),
    outputFormat: z.string().min(1, 'El formato de salida es requerido'),
  })
  .refine(
    (data: any) => {
      const validOutputs = validConversions[data.inputFormat];
      return validOutputs !== undefined && validOutputs.includes(data.outputFormat);
    },
    {
      message: 'La conversión entre estos formatos no es válida o soportada.',
      path: ['outputFormat'],
    }
  );

export type ConvertDocumentDto = z.infer<typeof ConvertDocumentSchema>;
