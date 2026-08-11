import { Module } from '@nestjs/common';
import { ConverterController } from './converter.controller';
import { ImageConverterService } from './services/image-converter.service';
import { HtmlConverterService } from './services/html-converter.service';
import { PandocConverterService } from './services/pandoc-converter.service';
import { XlsxConverterService } from './services/xlsx-converter.service';

@Module({
  controllers: [ConverterController],
  providers: [
    ImageConverterService,
    HtmlConverterService,
    PandocConverterService,
    XlsxConverterService,
  ],
})
export class ConverterModule {}
