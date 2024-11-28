import { z } from "zod";

export class ConversionValidator {
  constructor() {
    // Define los formatos de conversión válidos
    this.validConversions = {
      markdown: ["html", "epub", "docx", "pdf", "odt", "rtf", "tex", "plain", "jupyter"],
      html: ["markdown", "pdf", "epub", "docx", "odt", "rtf", "jupyter"],
      epub: ["html", "pdf", "markdown"],
      docx: ["markdown", "html", "pdf", "odt"],
      odt: ["docx", "pdf", "html", "markdown"],
      rtf: ["docx", "pdf", "html"],
      tex: ["pdf", "html"],
      plain: ["markdown"],
      jupyter: ["markdown", "html"],
      pdf: [], // PDF solo es formato de salida
    };

    // Esquema de validación con Zod
    this.schema = z.object({
      inputFormat: z.string().refine((val) => this.validConversions[val] !== undefined, {
        message: "Formato de entrada no válido.",
      }),
      outputFormat: z.string().refine((val) => Object.keys(this.validConversions).includes(val), {
        message: "Formato de salida no válido.",
      }),
    });
  }

  // Método estático para validar la conversión
  static isValidConversion(inputFormat, outputFormat) {
    const instance = new ConversionValidator();
    const validOutputs = instance.validConversions[inputFormat];
    return validOutputs && validOutputs.includes(outputFormat);
  }
}
