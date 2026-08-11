import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<any>) { }

  transform(value: any) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          campo: err.path.join('.'),
          mensaje: err.message,
        }));

        throw new BadRequestException({
          error: 'Validación de datos fallida',
          detalles: formattedErrors,
        });
      }

      throw new BadRequestException('Validación fallida');
    }
  }
}
