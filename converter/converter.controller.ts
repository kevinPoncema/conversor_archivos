import { Controller, Post, Body, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { ImageConverterService } from './services/image-converter.service';
import { HtmlConverterService } from './services/html-converter.service';
import { PandocConverterService } from './services/pandoc-converter.service';
import { XlsxConverterService } from './services/xlsx-converter.service';

import { ConvertImageDto } from './dtos/convert-image.dto';
import { ConvertHtmlMdDto } from './dtos/convert-html-md.dto';
import { ConvertDocumentDto } from './dtos/convert-document.dto';
import { ConvertXlsxDto } from './dtos/convert-xlsx.dto';

// Configuración compartida de Multer
const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const cleanName = file.originalname.replace(/\s+/g, '_');
      cb(null, `${Date.now()}-${cleanName}`);
    },
  }),
};

@Controller('convert')
export class ConverterController {
  constructor(
    private readonly imageService: ImageConverterService,
    private readonly htmlService: HtmlConverterService,
    private readonly pandocService: PandocConverterService,
    private readonly xlsxService: XlsxConverterService,
  ) { }

  @Post('image')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async convertImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ConvertImageDto,
  ) {
    this.ensureFileExists(file);
    return this.imageService.convertImage(file.path, dto);
  }

  @Post('html-md')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async convertHtmlMd(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ConvertHtmlMdDto,
  ) {
    this.ensureFileExists(file);
    return this.htmlService.convert(file.path, file.originalname, dto);
  }

  @Post('document')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async convertDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ConvertDocumentDto,
  ) {
    this.ensureFileExists(file);
    return this.pandocService.convertDocument(file.path, file.originalname, dto);
  }

  @Post('xlsx')
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
