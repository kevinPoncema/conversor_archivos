import * as fs from 'fs/promises';
import { Logger } from '@nestjs/common';

const logger = new Logger('DirectoryHelper');

/**
 * Crea un directorio de forma recursiva si no existe.
 * @param dirPath La ruta absoluta del directorio a verificar/crear.
 */
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'EEXIST') {
      logger.error(`Error al asegurar el directorio: ${dirPath}`, err);
    }
  }
}
