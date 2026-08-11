import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import sharp from 'sharp';
import * as path from 'path';
import * as process from 'process';
import { ConvertImageDto } from '../dtos/convert-image.dto';
import { scheduleFileDeletion } from '../helpers/file-cleanup.helper';
import { ensureDirectoryExists } from '../helpers/directory.helper';

@Injectable()
export class ImageConverterService {
  private readonly logger = new Logger(ImageConverterService.name);
  private readonly convertDir = path.join(process.cwd(), 'convert');

  constructor() {
    ensureDirectoryExists(this.convertDir);
  }

  /**
   * Ejecuta la conversión de la imagen.
   * @param inputPath La ruta del archivo temporal subido.
   * @param dto El objeto validado con el formato de salida.
   */
  async convertImage(inputPath: string, dto: ConvertImageDto): Promise<{ filePath: string; fileName: string }> {
    const { outputFormat } = dto;
    const uniqueName = `${Date.now()}-${path.basename(inputPath, path.extname(inputPath))}.${outputFormat}`;
    const outputPath = path.join(this.convertDir, uniqueName);

    try {
      await sharp(inputPath).toFormat(outputFormat as keyof sharp.FormatEnum).toFile(outputPath);
      this.logger.log(`Imagen convertida con éxito: ${uniqueName}`);
      scheduleFileDeletion(outputPath);

      return {
        filePath: `/download/${uniqueName}`,
        fileName: uniqueName,
      };
    } catch (err) {
      this.logger.error(`Error procesando la imagen ${inputPath}`, err);
      throw new InternalServerErrorException('Ocurrió un error al intentar convertir la imagen.');
    }
  }

}
