import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import * as xlsx from 'xlsx';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ConvertXlsxDto } from '../dtos/convert-xlsx.dto';
import { ensureDirectoryExists } from '../helpers/directory.helper';
import { scheduleFileDeletion, deleteFile } from '../helpers/file-cleanup.helper';
import { UnsupportedConversionException } from '../exceptions/unsupported-conversion.exception';

@Injectable()
export class XlsxConverterService {
  private readonly logger = new Logger(XlsxConverterService.name);
  private readonly convertDir = path.join(process.cwd(), 'convert');
  
  // Formatossoportados de entrada nativamente por tu API anterior
  private readonly supportedInputFormats = ['.xlsx', '.xls', '.csv'];

  constructor() {
    ensureDirectoryExists(this.convertDir);
  }

  /**
   * Ejecuta la conversión de hojas de cálculo usando la librería 'xlsx'.
   * @param inputPath La ruta del archivo temporal subido.
   * @param originalName El nombre original del archivo para mantener semántica.
   * @param dto El objeto validado con el formato de salida.
   */
  async convertDocument(inputPath: string, originalName: string, dto: ConvertXlsxDto): Promise<{ filePath: string; fileName: string }> {
    const inputExt = path.extname(originalName).toLowerCase();
    
    // Validar formato de entrada
    if (!this.supportedInputFormats.includes(inputExt)) {
      await deleteFile(inputPath);
      throw new UnsupportedConversionException(inputExt, dto.outputFormat);
    }

    const { outputFormat } = dto;
    const baseName = path.basename(originalName, inputExt);
    const outputFileName = `${baseName}-converted-${Date.now()}.${outputFormat}`;
    const outputPath = path.join(this.convertDir, outputFileName);

    try {
      // 1. Leer el archivo (xlsx maneja automáticamente xlsx, xls, csv)
      const workbook = xlsx.readFile(inputPath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // 2. Escribir el nuevo archivo según el formato
      // Previamente, solo tenías csv y xlsx, pero como en el DTO agregué soporte para JSON y TXT, 
      // lo integré aquí usando las propias utilidades de SheetJS.
      if (outputFormat === 'csv') {
        const csvData = xlsx.utils.sheet_to_csv(sheet);
        await fs.writeFile(outputPath, csvData, 'utf-8');
      } else if (outputFormat === 'json') {
        const jsonData = xlsx.utils.sheet_to_json(sheet);
        await fs.writeFile(outputPath, JSON.stringify(jsonData, null, 2), 'utf-8');
      } else if (outputFormat === 'txt') {
        const txtData = xlsx.utils.sheet_to_txt(sheet);
        await fs.writeFile(outputPath, txtData, 'utf-8');
      } else {
        // Por defecto para xlsx, xls, usamos la escritura binaria
        const newWorkbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(newWorkbook, sheet, sheetName);
        xlsx.writeFile(newWorkbook, outputPath);
      }

      this.logger.log(`Hoja de cálculo convertida con éxito: ${outputFileName}`);

      // 3. Eliminar el archivo original
      await deleteFile(inputPath);

      // 4. Programar la limpieza (Garbage Collection) del archivo final
      scheduleFileDeletion(outputPath);

      // 5. Retornar respuesta
      return {
        filePath: `/download/${outputFileName}`,
        fileName: outputFileName,
      };
    } catch (err: any) {
      this.logger.error(`Error durante la conversión de XLSX para ${inputPath}`, err.message || err);
      
      // Intentar borrar en caso de que un archivo corrupto haga fallar a SheetJS
      await deleteFile(inputPath);
      
      throw new InternalServerErrorException('Error interno durante la conversión de la hoja de cálculo.');
    }
  }
}
