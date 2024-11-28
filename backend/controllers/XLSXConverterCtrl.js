import xlsx from 'xlsx';
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

export class XLSXConverter {
  constructor() {
    this.supportedFormats = ['xlsx', 'xls', 'csv'];
  }

  // Método para obtener formatos soportados
  getSupportedFormats() {
    return this.supportedFormats;
  }

  // Método para validar formatos
  isValidConversion(inputFormat, outputFormat) {
    return (
      this.supportedFormats.includes(inputFormat) &&
      this.supportedFormats.includes(outputFormat)
    );
  }

  // Método para convertir un archivo
  async convertFile(inputPath, outputPath, outputFormat) {
    const workbook = xlsx.readFile(inputPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    if (outputFormat === 'csv') {
      const csvData = xlsx.utils.sheet_to_csv(sheet);
      await fs.writeFile(outputPath, csvData, 'utf-8');
    } else {
      const newWorkbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(newWorkbook, sheet, sheetName);
      xlsx.writeFile(newWorkbook, outputPath);
    }

    return outputPath;
  }

  // Método estático para manejar solicitudes de la API
  static async handleXLSX(req, res) {
    // Validar el esquema de entrada con Zod
    const schema = z.object({
      inputFormat: z.enum(['xlsx', 'xls', 'csv']),
      outputFormat: z.enum(['xlsx', 'xls', 'csv']),
    });

    try {
      const { file } = req;
      if (!file) {
        return res.status(400).json({ error: 'No se envió ningún archivo.' });
      }

      const validation = schema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      const { inputFormat, outputFormat } = validation.data;

      // Verificar formatos soportados
      const converter = new XLSXConverter();
      if (!converter.isValidConversion(inputFormat, outputFormat)) {
        return res.status(400).json({
          error: `La conversión de ${inputFormat} a ${outputFormat} no está soportada.`,
          supportedFormats: converter.getSupportedFormats(),
        });
      }

      // Crear carpeta para archivos convertidos
      const outputDir = path.resolve('convert');
      await fs.mkdir(outputDir, { recursive: true });

      // Generar nombre único para el archivo convertido
      const baseName = path.basename(file.originalname, path.extname(file.originalname));
      const outputFileName = `${baseName}-converted-${Date.now()}.${outputFormat}`;
      const outputPath = path.join(outputDir, outputFileName);

      // Convertir el archivo
      await converter.convertFile(file.path, outputPath, outputFormat);

      // Eliminar el archivo original después de la conversión
      try {
        await fs.unlink(file.path);
        console.log(`Archivo original eliminado: ${file.path}`);
      } catch (err) {
        console.error(`Error al eliminar el archivo original: ${err.message}`);
      }

      // Programar eliminación del archivo convertido después de 40 minutos
      setTimeout(async () => {
        try {
          await fs.unlink(outputPath);
          console.log(`Archivo eliminado automáticamente: ${outputPath}`);
        } catch (err) {
          console.error(`Error al eliminar el archivo convertido: ${err.message}`);
        }
      }, 40 * 60 * 1000);

      // Responder con la ruta del archivo convertido
      res.json({ success: true, convertedFilePath: outputPath });
    } catch (error) {
      console.error('Error durante la conversión:', error);
      res.status(500).json({ error: 'Error durante la conversión del archivo.' });
    }
  }
}
