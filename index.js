import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
///controladores
import { handleImageConversion } from './controllers/imageConverterCtrl.js';
import { handleConversionHTMLYMD } from './controllers/htmlConvert.js';
import { PandocController } from './controllers/PandocController.js';
import {XLSXConverter} from "./controllers/XLSXConverterCtrl.js"
import fs from 'fs';

//autodocumentacion
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {swaggerOptions} from "./SwaggerConfig.js"
//configuraciones generales
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json()); // Asegúrate de que los datos JSON puedan procesarse

// Directorio temporal para subir archivos
const tempDir = path.join(__dirname, 'uploads');
const convertDir = path.resolve('convert')
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Rutas de la API
// Genera la especificación de Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);
// Ruta para servir la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /convert-image:
 *   post:
 *     summary: Convierte imágenes entre formatos compatibles.
 *     description: Este endpoint permite convertir imágenes de un formato a otro. Admite formatos como `jpg`, `jpeg`, `png`, `webp` y `tiff`.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: file
 *         in: formData
 *         required: true
 *         type: file
 *         description: Archivo de imagen a convertir.
 *       - name: inputFormat
 *         in: formData
 *         required: true
 *         type: string
 *         description: Formato del archivo de entrada.
 *       - name: outputFormat
 *         in: formData
 *         required: true
 *         type: string
 *         description: Formato deseado para el archivo de salida.
 *     responses:
 *       200:
 *         description: Conversión exitosa. Devuelve un enlace de descarga.
 *       400:
 *         description: Parámetros inválidos.
 *       500:
 *         description: Error interno del servidor durante la conversión.
 */
app.post('/convert-image', upload.single('file'), handleImageConversion); // Conversión de imágenes

// Endpoint para convertir entre HTML y Markdown
/**
 * @swagger
 * /convert-html-md:
 *   post:
 *     summary: Convierte archivos entre HTML y Markdown.
 *     description: Este endpoint permite convertir archivos de HTML a Markdown y viceversa.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: file
 *         in: formData
 *         required: true
 *         type: file
 *         description: Archivo HTML o Markdown a convertir.
 *       - name: inputFormat
 *         in: formData
 *         required: true
 *         type: string
 *         description: Formato del archivo de entrada (`html` o `md`).
 *       - name: outputFormat
 *         in: formData
 *         required: true
 *         type: string
 *         description: Formato deseado para el archivo de salida (`html` o `md`).
 *     responses:
 *       200:
 *         description: Conversión exitosa. Devuelve un enlace de descarga.
 *       400:
 *         description: Parámetros inválidos.
 *       500:
 *         description: Error interno del servidor durante la conversión.
 */
app.post('/convert-html-md', upload.single('file'), handleConversionHTMLYMD); // Conversión HTML/Markdown
// Endpoint para convertir documentos con Pandoc
/**
 * @swagger
 * /convert-document:
 *   post:
 *     summary: Convierte documentos entre formatos soportados por Pandoc.
 *     description: Permite la conversión de documentos usando [Pandoc](https://pandoc.org/). Soporta una amplia variedad de formatos de entrada y salida.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: file
 *         in: formData
 *         required: true
 *         type: file
 *         description: Archivo a convertir.
 *       - name: inputFormat
 *         in: formData
 *         required: true
 *         type: string
 *         description: Formato del archivo de entrada (compatible con Pandoc).
 *       - name: outputFormat
 *         in: formData
 *         required: true
 *         type: string
 *         description: Formato deseado para el archivo de salida (compatible con Pandoc).
 *     responses:
 *       200:
 *         description: Conversión exitosa. Devuelve un enlace de descarga.
 *       400:
 *         description: Parámetros inválidos.
 *       500:
 *         description: Error interno del servidor durante la conversión.
 */
app.post('/convert-document', upload.single('file'), PandocController.handleConversionRequest); // Conversión general con Pandoc

// Endpoint para convertir hojas de cálculo
/**
 * @swagger
 * /convert-xlsx:
 *   post:
 *     summary: Convierte hojas de cálculo entre diferentes formatos.
 *     description: Permite convertir archivos de hojas de cálculo (`xlsx`, `xls`, `csv`) entre formatos compatibles.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: file
 *         in: formData
 *         required: true
 *         type: file
 *         description: Archivo de hoja de cálculo a convertir.
 *       - name: inputFormat
 *         in: formData
 *         required: true
 *         type: string
 *         description: Formato del archivo de entrada (`xlsx`, `xls`, `csv`).
 *       - name: outputFormat
 *         in: formData
 *         required: true
 *         type: string
 *         description: Formato deseado para el archivo de salida (`xlsx`, `xls`, `csv`).
 *     responses:
 *       200:
 *         description: Conversión exitosa. Devuelve un enlace de descarga.
 *       400:
 *         description: Parámetros inválidos.
 *       500:
 *         description: Error interno del servidor durante la conversión.
 */
app.post('/convert-xlsx', upload.single('file'), XLSXConverter.handleXLSX); // conversion archivos de excel


// Endpoint para obtener formatos soportados
/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtiene una lista de formatos soportados.
 *     description: Devuelve un JSON con las rutas disponibles y los formatos compatibles para la conversión.
 *     responses:
 *       200:
 *         description: Lista de rutas y formatos soportados.
 */

app.get('/', (req, res) => {
  const PandocControllerFormats = PandocController.getCompatibleFormats();
  const data = {
    '/convert-document':PandocControllerFormats ,
    '/convert-image': {
      'allow-formats': ['jpg', 'jpeg', 'png', 'webp', 'tiff'],
    },
    '/convert-html-md': {
      'allow-formats': ['html', 'md'],
    },
  };
  res.json(data);
});

// Endpoint para descargar archivos
/**
 * @swagger
 * /download/{fileName}:
 *   get:
 *     summary: Descarga un archivo previamente convertido.
 *     description: Descarga un archivo convertido usando su nombre único generado por el servidor.
 *     parameters:
 *       - name: fileName
 *         in: path
 *         required: true
 *         type: string
 *         description: Nombre del archivo generado por el servidor.
 *     responses:
 *       200:
 *         description: Descarga iniciada.
 *       404:
 *         description: Archivo no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
app.get('/download/:fileName', async (req, res) => {
  const { fileName } = req.params; // Obtener el nombre del archivo desde los parámetros de la URL
  const filePath = path.join(convertDir, fileName);

  try {
    // Verificar si el archivo existe
    await fs.promises.access(filePath);

    // Iniciar la descarga del archivo
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error(`Error al descargar el archivo: ${err.message}`);
        res.status(500).json({ error: 'Error al descargar el archivo.' });
      }
    });
  } catch (err) {
    console.error(`Archivo no encontrado: ${filePath}`);
    res.status(404).json({ error: 'Archivo no encontrado.' });
  }
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
