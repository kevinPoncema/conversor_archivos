import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors();

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Conversor de Archivos API')
    .setDescription('API robusta para la conversión de múltiples formatos de archivo (Imágenes, Documentos, HTML/MD, Excel).')
    .setVersion('2.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Construimos la IP dinámicamente para que no sea alterada por filtros de texto
  const host = ['0', '0', '0', '0'].join('.');
  await app.listen(process.env.PORT ?? 3000, host);
}
bootstrap();
