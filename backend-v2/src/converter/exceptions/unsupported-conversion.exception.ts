import { BadRequestException } from '@nestjs/common';

export class UnsupportedConversionException extends BadRequestException {
  constructor(inputFormat: string, outputFormat: string) {
    super(`La conversión de '${inputFormat}' a '${outputFormat}' no es soportada o no es válida.`);
  }
}
