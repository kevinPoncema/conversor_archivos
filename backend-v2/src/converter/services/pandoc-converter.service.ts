import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { exec } from 'child_process';
import * as util from 'util';
import * as path from 'path';
import { ConvertDocumentDto } from '../dtos/convert-document.dto';
import { ensureDirectoryExists } from '../helpers/directory.helper';
import { scheduleFileDeletion, deleteFile } from '../helpers/file-cleanup.helper';
import { UnsupportedConversionException } from '../exceptions/unsupported-conversion.exception';

const execPromise = util.promisify(exec);

@Injectable()
export class PandocConverterService {
  private readonly logger = new Logger(PandocConverterService.name);
  private readonly convertDir = path.join(process.cwd(), 'convert');

  constructor() {
    ensureDirectoryExists(this.convertDir);
  }

  /**
   * Ejecuta la conversión de documentos usando el binario de Pandoc.
   * @param inputPath La ruta del archivo temporal subido.
   * @param originalName El nombre original del archivo para mantener semántica.
   * @param dto El objeto validado con el formato de entrada y salida.
   */
  async convertDocument(inputPath: string, originalName: string, dto: ConvertDocumentDto): Promise<{ filePath: string; fileName: string }> {
    const { inputFormat, outputFormat } = dto;

    const baseName = path.basename(originalName, path.extname(originalName));
    const outputFileName = `${baseName}-converted-${Date.now()}.${outputFormat}`;
    const outputPath = path.join(this.convertDir, outputFileName);

    try {
      const command = `pandoc -f ${inputFormat} -t ${outputFormat} "${inputPath}" -o "${outputPath}"`;

      this.logger.debug(`Ejecutando comando: ${command}`);

      const { stdout, stderr } = await execPromise(command);

      if (stderr && stderr.toLowerCase().includes('error')) {
        this.logger.warn(`Pandoc stderr (advertencia o error no fatal): ${stderr}`);
      }

      this.logger.log(`Documento convertido con éxito: ${outputFileName}`);
      await deleteFile(inputPath);
      scheduleFileDeletion(outputPath);

      return {
        filePath: `/convert/download/${outputFileName}`,
        fileName: outputFileName,
      };
    } catch (err: any) {
      this.logger.error(`Error durante la ejecución de pandoc para ${inputPath}`, err.stderr || err.message || err);
      await deleteFile(inputPath);
      throw new InternalServerErrorException('Error interno durante la conversión del documento con Pandoc.');
    }
  }
}
