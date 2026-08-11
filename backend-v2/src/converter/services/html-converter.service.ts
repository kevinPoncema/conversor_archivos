import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
// import * as TurndownService from 'turndown'; // Fallback a require si da problemas de tipos
// import * as showdown from 'showdown';
import TurndownService from 'turndown';
import showdown from 'showdown';
import { ConvertHtmlMdDto } from '../dtos/convert-html-md.dto';
import { scheduleFileDeletion, deleteFile } from '../helpers/file-cleanup.helper';
import { ensureDirectoryExists } from '../helpers/directory.helper';
import { UnsupportedConversionException } from '../exceptions/unsupported-conversion.exception';

@Injectable()
export class HtmlConverterService {
  private readonly logger = new Logger(HtmlConverterService.name);
  private readonly convertDir = path.join(process.cwd(), 'convert');

  constructor() {
    ensureDirectoryExists(this.convertDir);
  }

  /**
   * Ejecuta la conversión de Markdown a HTML o viceversa.
   */
  async convert(inputPath: string, originalName: string, dto: ConvertHtmlMdDto): Promise<{ filePath: string; fileName: string }> {
    // Inferimos el formato de entrada por la extensión del archivo
    const inputExt = path.extname(originalName).toLowerCase();
    const inputFormat = (inputExt === '.md' || inputExt === '.markdown') ? 'md' : 'html';
    const { outputFormat } = dto;
    
    let outputPath: string;

    try {
      const fileContent = await fs.readFile(inputPath, 'utf-8');

      if (inputFormat === 'md' && outputFormat === 'html') {
        outputPath = await this.convertMarkdownToHtml(fileContent, originalName);
      } else if (inputFormat === 'html' && outputFormat === 'md') {
        outputPath = await this.convertHtmlToMarkdown(fileContent, originalName);
      } else {
        throw new UnsupportedConversionException(inputFormat, outputFormat);
      }

      this.logger.log(`Archivo convertido con éxito: ${path.basename(outputPath)}`);

      // Eliminar el archivo original (ya que solo nos sirvió para leer el contenido)
      await deleteFile(inputPath);

      // Programar la limpieza del archivo convertido
      scheduleFileDeletion(outputPath);

      const fileName = path.basename(outputPath);
      return {
        filePath: `/download/${fileName}`,
        fileName,
      };
    } catch (err) {
      this.logger.error(`Error procesando el archivo ${inputPath}`, err);
      if (err instanceof UnsupportedConversionException) throw err;
      throw new InternalServerErrorException('Ocurrió un error al intentar convertir el documento.');
    }
  }

  private async convertMarkdownToHtml(markdownContent: string, originalName: string): Promise<string> {
    const converter = new showdown.Converter();
    const htmlContent = converter.makeHtml(markdownContent);
    const fileName = `${path.basename(originalName, path.extname(originalName))}-to-html-${Date.now()}.html`;
    const outputPath = path.join(this.convertDir, fileName);

    await fs.writeFile(outputPath, htmlContent);
    return outputPath;
  }

  private async convertHtmlToMarkdown(htmlContent: string, originalName: string): Promise<string> {
    const turndownService = new TurndownService();
    const markdownContent = turndownService.turndown(htmlContent);
    const fileName = `${path.basename(originalName, path.extname(originalName))}-to-markdown-${Date.now()}.md`;
    const outputPath = path.join(this.convertDir, fileName);

    await fs.writeFile(outputPath, markdownContent);
    return outputPath;
  }

}
