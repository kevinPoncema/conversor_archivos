// Archivo: imageConverterCtrl.js
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

// Ruta de la carpeta donde se guardarán las imágenes convertidas
const convertDir = path.join(process.cwd(), 'convert');

// Crear la carpeta si no existe
fs.mkdir(convertDir, { recursive: true }).catch(err => {
  console.error('Error al crear el directorio de conversión:', err);
});

// Función para convertir una imagen
export async function convertImage(inputPath, outputFormat) {
  const supportedFormats = ['jpg','jpeg', 'png', 'webp', 'tiff'];

  if (!supportedFormats.includes(outputFormat)) {
    throw new Error(`Formato no soportado: ${outputFormat}`);
  }

  const uniqueName = `${Date.now()}-${path.basename(inputPath, path.extname(inputPath))}.${outputFormat}`;
  const outputPath = path.join(convertDir, uniqueName);

  try {
    await sharp(inputPath).toFormat(outputFormat).toFile(outputPath);

    // Programar eliminación del archivo después de 40 minutos
    setTimeout(async () => {
      try {
        await fs.unlink(outputPath);
        console.log(`Archivo eliminado: ${outputPath}`);
      } catch (err) {
        console.error(`Error al eliminar el archivo: ${outputPath}`, err);
      }
    }, 40 * 60 * 1000);

    return outputPath;
  } catch (err) {
    console.error('Error al convertir la imagen:', err);
    throw err;
  }
}

// Controlador para la API
export async function handleImageConversion(req, res) {
  const schema = z.object({
    inputFormat: z.string().nonempty().refine(format => ['jpg','jpeg', 'png', 'webp', 'tiff'].includes(format), {
      message: 'Formato de entrada no soportado',
    }),
    outputFormat: z.string().nonempty().refine(format => ['jpg','jpeg', 'png', 'webp', 'tiff'].includes(format), {
      message: 'Formato de salida no soportado',
    }),
  });

  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ error: 'No se envió ningún archivo.' });
    }

    const parsedBody = schema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error.errors });
    }

    const { outputFormat } = parsedBody.data;
    const outputPath = await convertImage(file.path, outputFormat);
    const fileName = path.basename(outputPath);
    
    res.json({ status: 'successful', filePath: `/download/${fileName}`,fileName:fileName });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}
