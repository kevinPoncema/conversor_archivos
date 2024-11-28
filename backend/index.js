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
app.post('/convert-image', upload.single('file'), handleImageConversion); // Conversión de imágenes
app.post('/convert-html-md', upload.single('file'), handleConversionHTMLYMD); // Conversión HTML/Markdown
app.post('/convert-document', upload.single('file'), PandocController.handleConversionRequest); // Conversión general con Pandoc
app.post('/convert-xlsx', upload.single('file'), XLSXConverter.handleXLSX); // conversion archivos de excel

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
