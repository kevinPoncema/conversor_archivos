// Configuración de Swagger
export const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'FILE CONVERTER API DOC',
        version: '1.0.0',
        description:
          'Esta API permite a los desarrolladores convertir archivos de diversos formatos, destacando entre ellos imágenes, archivos de marcado (HTML y Markdown) y documentos de ofimática. Ofrece soporte para una amplia variedad de formatos, utilizando herramientas especializadas como Pandoc para manejar las conversiones de documentos ofimáticos. Diseñada con un enfoque en la simplicidad, esta API es fácil de integrar y usar, proporcionando una solución eficiente y práctica para la conversión de archivos.',
      },
      servers: [
        {
          url: 'http://localhost:3000', // Cambia esto según tu URL base
        },
      ],
      paths: {}, // Se llena con las rutas documentadas
    },
    apis: ['./index.js'], // Opcional si quieres incluir anotaciones directamente en el código
  };
  
  // Documentación de rutas
  export const swaggerDocs = {
    '/': {
      get: {
        summary: 'Obtiene una lista de formatos soportados.',
        description: 'Devuelve un JSON con las rutas disponibles y los formatos compatibles para la conversión.',
        responses: {
          200: { description: 'Lista de rutas y formatos soportados.' },
        },
      },
    },
    '/convert-image': {
      post: {
        summary: 'Convierte imágenes entre formatos compatibles.',
        description:
          'Este endpoint permite convertir imágenes de un formato a otro. Admite formatos como `jpg`, `jpeg`, `png`, `webp` y `tiff`.',
        consumes: ['multipart/form-data'],
        parameters: [
          { name: 'file', in: 'formData', required: true, type: 'file', description: 'Archivo de imagen a convertir.' },
          { name: 'inputFormat', in: 'formData', required: true, type: 'string', description: 'Formato del archivo de entrada.' },
          { name: 'outputFormat', in: 'formData', required: true, type: 'string', description: 'Formato deseado para el archivo de salida.' },
        ],
        responses: {
          200: { description: 'Conversión exitosa. Devuelve un enlace de descarga.' },
          400: { description: 'Parámetros inválidos.' },
          500: { description: 'Error interno del servidor durante la conversión.' },
        },
      },
    },
    '/convert-html-md': {
      post: {
        summary: 'Convierte archivos entre HTML y Markdown.',
        description: 'Este endpoint permite convertir archivos de HTML a Markdown y viceversa.',
        consumes: ['multipart/form-data'],
        parameters: [
          { name: 'file', in: 'formData', required: true, type: 'file', description: 'Archivo HTML o Markdown a convertir.' },
          { name: 'inputFormat', in: 'formData', required: true, type: 'string', description: 'Formato del archivo de entrada (`html` o `md`).' },
          { name: 'outputFormat', in: 'formData', required: true, type: 'string', description: 'Formato deseado para el archivo de salida (`html` o `md`).' },
        ],
        responses: {
          200: { description: 'Conversión exitosa. Devuelve un enlace de descarga.' },
          400: { description: 'Parámetros inválidos.' },
          500: { description: 'Error interno del servidor durante la conversión.' },
        },
      },
    },
    '/convert-document': {
      post: {
        summary: 'Convierte documentos entre formatos soportados por Pandoc.',
        description:
          'Permite la conversión de documentos usando [Pandoc](https://pandoc.org/). Soporta una amplia variedad de formatos de entrada y salida.',
        consumes: ['multipart/form-data'],
        parameters: [
          { name: 'file', in: 'formData', required: true, type: 'file', description: 'Archivo a convertir.' },
          { name: 'inputFormat', in: 'formData', required: true, type: 'string', description: 'Formato del archivo de entrada (compatible con Pandoc).' },
          { name: 'outputFormat', in: 'formData', required: true, type: 'string', description: 'Formato deseado para el archivo de salida (compatible con Pandoc).' },
        ],
        responses: {
          200: { description: 'Conversión exitosa. Devuelve un enlace de descarga.' },
          400: { description: 'Parámetros inválidos.' },
          500: { description: 'Error interno del servidor durante la conversión.' },
        },
      },
    },
    '/convert-xlsx': {
      post: {
        summary: 'Convierte hojas de cálculo entre diferentes formatos.',
        description: 'Permite convertir archivos de hojas de cálculo (`xlsx`, `xls`, `csv`) entre formatos compatibles.',
        consumes: ['multipart/form-data'],
        parameters: [
          { name: 'file', in: 'formData', required: true, type: 'file', description: 'Archivo de hoja de cálculo a convertir.' },
          { name: 'inputFormat', in: 'formData', required: true, type: 'string', description: 'Formato del archivo de entrada (`xlsx`, `xls`, `csv`).' },
          { name: 'outputFormat', in: 'formData', required: true, type: 'string', description: 'Formato deseado para el archivo de salida (`xlsx`, `xls`, `csv`).' },
        ],
        responses: {
          200: { description: 'Conversión exitosa. Devuelve un enlace de descarga.' },
          400: { description: 'Parámetros inválidos.' },
          500: { description: 'Error interno del servidor durante la conversión.' },
        },
      },
    },
    '/download/{fileName}': {
      get: {
        summary: 'Descarga un archivo previamente convertido.',
        description: 'Descarga un archivo convertido usando su nombre único generado por el servidor.',
        parameters: [
          { name: 'fileName', in: 'path', required: true, type: 'string', description: 'Nombre del archivo generado por el servidor.' },
        ],
        responses: {
          200: { description: 'Descarga iniciada.' },
          404: { description: 'Archivo no encontrado.' },
          500: { description: 'Error interno del servidor.' },
        },
      },
    },
  };
  
  // Asignar las rutas documentadas a las opciones
  swaggerOptions.definition.paths = swaggerDocs;
  