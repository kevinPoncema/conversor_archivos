import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<any>) { }

  transform(value: any) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = (error as any).errors.map((err: any) => ({
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
