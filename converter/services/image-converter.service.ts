import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ConvertImageDto } from '../dtos/convert-image.dto';
import { scheduleFileDeletion } from '../helpers/file-cleanup.helper';

@Injectable()
export class ImageConverterService {
  // NestJS provee un Logger nativo muy elegante
  private readonly logger = new Logger(ImageConverterService.name);
  
  // En un proyecto más grande, esto podría venir de un ConfigService (variables de entorno)
  private readonly convertDir = path.join(process.cwd(), 'convert');

  constructor() {
    this.ensureConvertDirectory();
  }

  // Se asegura de que la carpeta exista al inicializar el servicio
  private async ensureConvertDirectory() {
    try {
      await fs.mkdir(this.convertDir, { recursive: true });
      this.logger.log('Directorio de conversión inicializado.');
    } catch (err) {
      this.logger.error('Error al crear el directorio de conversión', err);
    }
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
      // 1. Convertir la imagen usando Sharp
      await sharp(inputPath).toFormat(outputFormat as keyof sharp.FormatEnum).toFile(outputPath);
      this.logger.log(`Imagen convertida con éxito: ${uniqueName}`);

      // 2. Programar la limpieza (Garbage Collection)
      scheduleFileDeletion(outputPath);

      // 3. Devolver solo lo necesario (el controlador armará la respuesta final HTTP)
      return {
        filePath: `/download/${uniqueName}`,
        fileName: uniqueName,
      };
    } catch (err) {
      this.logger.error(`Error procesando la imagen ${inputPath}`, err);
      // Lanzamos una excepción de NestJS que será atrapada automáticamente y devuelta como un 500
      throw new InternalServerErrorException('Ocurrió un error al intentar convertir la imagen.');
    }
  }

}
