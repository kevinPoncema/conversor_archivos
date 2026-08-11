import * as fs from 'fs/promises';
import { Logger } from '@nestjs/common';

const logger = new Logger('FileCleanupHelper');

/**
 * Elimina un archivo automáticamente después de un tiempo determinado (por defecto 40 minutos).
 * @param filePath La ruta absoluta del archivo a eliminar.
 * @param delayMs El tiempo de espera en milisegundos.
 */
export function scheduleFileDeletion(filePath: string, delayMs: number = 40 * 60 * 1000): void {
  setTimeout(async () => {
    try {
      await fs.unlink(filePath);
      logger.log(`Archivo temporal eliminado: ${filePath}`);
    } catch (err) {
      logger.error(`Error al intentar eliminar el archivo expirado: ${filePath}`, err);
    }
  }, delayMs);
}

/**
 * Elimina un archivo de forma inmediata y asíncrona.
 * @param filePath La ruta absoluta del archivo a eliminar.
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
    logger.log(`Archivo eliminado: ${filePath}`);
  } catch (err) {
    logger.error(`Error al eliminar el archivo: ${filePath}`, err);
  }
}
