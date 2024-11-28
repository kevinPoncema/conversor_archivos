import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
// Librerías de conversión
import TurndownService from 'turndown';
import showdown from 'showdown';

// Ruta de la carpeta donde se guardarán los archivos convertidos
const convertDir = path.join(process.cwd(), 'convert');

// Crear la carpeta si no existe
fs.mkdir(convertDir, { recursive: true }).catch(err => {
  console.error('Error al crear el directorio de conversión:', err);
});

// Función para convertir Markdown a HTML
async function convertMarkdownToHtml(markdownContent, originalName) {
  const converter = new showdown.Converter();
  const htmlContent = converter.makeHtml(markdownContent);
  const fileName = `${path.basename(originalName, path.extname(originalName))}-to-html-${Date.now()}.html`;
  const outputPath = path.join(convertDir, fileName);

  await fs.writeFile(outputPath, htmlContent);
  return outputPath;
}

// Función para convertir HTML a Markdown
async function convertHtmlToMarkdown(htmlContent, originalName) {
  const turndownService = new TurndownService();
  const markdownContent = turndownService.turndown(htmlContent);
  const fileName = `${path.basename(originalName, path.extname(originalName))}-to-markdown-${Date.now()}.md`;
  const outputPath = path.join(convertDir, fileName);
  await fs.writeFile(outputPath, markdownContent);
  return outputPath;
}

// Controlador para la API
export async function handleConversionHTMLYMD(req, res) {
  const schema = z.object({
    inputFormat: z.enum(['markdown', 'html']),
    outputFormat: z.enum(['markdown', 'html']),
  });

  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ error: 'No se envió ningún archivo.' });
    }

    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const { inputFormat, outputFormat } = validation.data;
    let outputPath;

    // Convertir según los formatos de entrada y salida
    if (inputFormat === 'markdown' && outputFormat === 'html') {
      const markdownContent = await fs.readFile(file.path, 'utf-8');
      outputPath = await convertMarkdownToHtml(markdownContent, file.originalname);
    } else if (inputFormat === 'html' && outputFormat === 'markdown') {
      const htmlContent = await fs.readFile(file.path, 'utf-8');
      outputPath = await convertHtmlToMarkdown(htmlContent, file.originalname);
    } else {
      return res.status(400).json({ error: 'Conversión no soportada.' });
    }

    // Eliminar el archivo original
    try {
      await fs.unlink(file.path);
      console.log(`Archivo original eliminado: ${file.path}`);
    } catch (err) {
      console.error(`Error al eliminar el archivo original: ${file.path}`, err);
    }

    // Programar eliminación del archivo convertido después de 40 minutos
    setTimeout(async () => {
      try {
        await fs.unlink(outputPath);
        console.log(`Archivo eliminado: ${outputPath}`);
      } catch (err) {
        console.error(`Error al eliminar el archivo: ${outputPath}`, err);
      }
    }, 40 * 60 * 1000);
    // Extraer el nombre del archivo del outputPath
    const fileName = path.basename(outputPath);
    res.json({ status: 'successful', filePath: `/download/${fileName}`,fileName:fileName });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}
