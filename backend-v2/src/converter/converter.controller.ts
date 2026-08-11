import { Controller, Post, Body, UploadedFile, UseInterceptors, BadRequestException, UsePipes } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ImageConverterService } from './services/image-converter.service';
import { HtmlConverterService } from './services/html-converter.service';
import { PandocConverterService } from './services/pandoc-converter.service';
import { XlsxConverterService } from './services/xlsx-converter.service';
import type { ConvertImageDto } from './dtos/convert-image.dto';
import type { ConvertHtmlMdDto } from './dtos/convert-html-md.dto';
import type { ConvertDocumentDto } from './dtos/convert-document.dto';
import type { ConvertXlsxDto } from './dtos/convert-xlsx.dto';

// Configuración compartida de Multer
const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req: any, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      const cleanName = file.originalname.replace(/\s+/g, '_');
      cb(null, `${Date.now()}-${cleanName}`);
    },
  }),
};

@ApiTags('Conversión de Archivos')
@Controller('convert')
export class ConverterController {
  constructor(
    private readonly imageService: ImageConverterService,
    private readonly htmlService: HtmlConverterService,
    private readonly pandocService: PandocConverterService,
    private readonly xlsxService: XlsxConverterService,
  ) { }

  @Post('image')
  @ApiOperation({ summary: 'Convertir Imágenes', description: 'Soporta jpg, jpeg, png, webp, tiff.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'El archivo de imagen a convertir' },
        outputFormat: { type: 'string', description: 'Formato de salida (ej. png, webp)' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  // @UsePipes(new ZodValidationPipe(ConvertImageSchema)) // Descomentar al usar el pipe global
  async convertImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ConvertImageDto,
  ) {
    this.ensureFileExists(file);
    return this.imageService.convertImage(file.path, dto);
  }

  @Post('html-md')
  @ApiOperation({ summary: 'Convertir Markdown a HTML y viceversa' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'El archivo HTML o MD' },
        outputFormat: { type: 'string', description: 'Formato de salida (html o md)' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async convertHtmlMd(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ConvertHtmlMdDto,
  ) {
    this.ensureFileExists(file);
    return this.htmlService.convert(file.path, file.originalname, dto);
  }

  @Post('document')
  @ApiOperation({ summary: 'Convertir Documentos (Pandoc)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        inputFormat: { type: 'string', description: 'Formato original (ej. docx, markdown)' },
        outputFormat: { type: 'string', description: 'Formato de salida (ej. pdf, epub)' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async convertDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ConvertDocumentDto,
  ) {
    this.ensureFileExists(file);
    return this.pandocService.convertDocument(file.path, file.originalname, dto);
  }

  @Post('xlsx')
  @ApiOperation({ summary: 'Convertir Hojas de Cálculo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        outputFormat: { type: 'string', description: 'Formato de salida (ej. csv, json, xlsx)' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async convertXlsx(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ConvertXlsxDto,
  ) {
    this.ensureFileExists(file);
    return this.xlsxService.convertDocument(file.path, file.originalname, dto);
  }

  /**
   * Helper privado del controlador para asegurar que multer recibió el archivo exitosamente.
   */
  private ensureFileExists(file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se envió ningún archivo en la petición.');
    }
  }
}
