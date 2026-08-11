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
      const workbook = xlsx.readFile(inputPath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      if (outputFormat === 'csv') {
        await this.exportToCsv(sheet, outputPath);
      } else if (outputFormat === 'json') {
        await this.exportToJson(sheet, outputPath);
      } else if (outputFormat === 'txt') {
        await this.exportToTxt(sheet, outputPath);
      } else {
        this.exportToWorkbook(sheet, sheetName, outputPath);
      }

      this.logger.log(`Hoja de cálculo convertida con éxito: ${outputFileName}`);
      await deleteFile(inputPath);
      scheduleFileDeletion(outputPath);

      return {
        filePath: `/convert/download/${outputFileName}`,
        fileName: outputFileName,
      };
    } catch (err: any) {
      this.logger.error(`Error durante la conversión de XLSX para ${inputPath}`, err.message || err);
      await deleteFile(inputPath);
      throw new InternalServerErrorException('Error interno durante la conversión de la hoja de cálculo.');
    }
  }

  private async exportToCsv(sheet: xlsx.WorkSheet, outputPath: string): Promise<void> {
    const csvData = xlsx.utils.sheet_to_csv(sheet);
    await fs.writeFile(outputPath, csvData, 'utf-8');
  }

  private async exportToJson(sheet: xlsx.WorkSheet, outputPath: string): Promise<void> {
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    await fs.writeFile(outputPath, JSON.stringify(jsonData, null, 2), 'utf-8');
  }

  private async exportToTxt(sheet: xlsx.WorkSheet, outputPath: string): Promise<void> {
    const txtData = xlsx.utils.sheet_to_txt(sheet);
    await fs.writeFile(outputPath, txtData, 'utf-8');
  }

  private exportToWorkbook(sheet: xlsx.WorkSheet, sheetName: string, outputPath: string): void {
    const newWorkbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWorkbook, sheet, sheetName);
    xlsx.writeFile(newWorkbook, outputPath);
  }
}
