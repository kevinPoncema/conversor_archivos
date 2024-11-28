// Configuración de Swagger
export const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'Documentación generada automáticamente para tu API',
      },
      servers: [
        {
          url: 'http://localhost:3000', // Cambia esto según tu URL base
        },
      ],
    },
    apis: ['./index.js'], // Archivos donde defines tus rutas
  };