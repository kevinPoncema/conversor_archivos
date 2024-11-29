# Proyecto de Conversión de Archivos

Este proyecto no fue diseñado como una alternativa profesional o comercial, sino como una prueba técnica para demostrar mis habilidades en **backend**, que es mi área de especialización, y en **frontend**, que aunque no es mi fuerte, logré construir algo funcional y bien logrado.

## Propósito del Proyecto

El objetivo principal fue mostrar mi capacidad para trabajar con:
- **Backend**: Desarrollo de una API robusta para la conversión de archivos.
- **Frontend**: Construcción de una interfaz funcional para interactuar con la API.
- **Asincronía y manejo de archivos**: Implementación eficiente de procesos de larga duración.
- **Contenedores Docker**: Creación de una imagen personalizada para el backend con dependencias específicas.

## Características del Proyecto

- **Conversión de archivos**: 
  - Soporte para múltiples formatos (imágenes, documentos, hojas de cálculo y marcado).
  - Uso de librerías especializadas para conversiones eficientes.
- **API Documentada**:
  - Documentación interactiva con **Swagger** para facilitar su exploración y prueba.
- **Frontend**:
  - Interfaz construida con **Vue 3** y **TypeScript**.
- **Despliegue con Docker**:
  - Backend encapsulado en un contenedor basado en una imagen personalizada que incluye:
    - Dependencias de **Node.js**.
    - **Pandoc** para conversiones avanzadas en Linux.

---

## Tecnologías Utilizadas

### Backend
- **Node.js**: Plataforma principal para manejar solicitudes y lógica de conversión.
- **Librerías de Conversión**:
  - Módulos especializados para manejar formatos complejos.
  - **Pandoc**: Herramienta clave para la conversión de documentos en sistemas Linux.
- **Swagger**: Generación de documentación interactiva para la API.

### Frontend
- **Vue 3**: Framework utilizado para construir la interfaz.
- **TypeScript**: Asegura un código más claro y con menos errores.
- **TailwindCSS**: Permite un diseño limpio y moderno.

### Despliegue
- **Docker**:
  - Creación de una imagen personalizada basada en **Node.js**.
  - Configuración de **Pandoc** y otras dependencias necesarias.
  - Contenedor aislado y reproducible para el backend.

---

## Funcionalidades Clave

- **Subida de Archivos**:
  - Los usuarios pueden subir archivos desde el frontend para su conversión.
  - Soporte para múltiples formatos de entrada y salida.
- **Procesos Asíncronos**:
  - Indicadores en tiempo real durante la conversión.
  - Manejo de operaciones de larga duración sin bloquear la aplicación.
- **Eliminación Automática**:
  - Los archivos convertidos se eliminan automáticamente después de un tiempo definido.
- **Frontend Funcional**:
  - Aunque el frontend no es mi especialidad, la interfaz incluye:
    - Selección de formatos.
    - Mensajes de estado.
    - Descarga de los archivos convertidos.
- **Contenedores Docker**:
  - El backend se despliega dentro de un contenedor, mostrando mi capacidad para trabajar con contenedores y manejar configuraciones complejas.

---

## Mi Rol en el Proyecto

Este proyecto fue diseñado para demostrar:
- **Mis habilidades en backend**:
  - Construcción de una API funcional y bien estructurada.
  - Gestión de archivos y asincronía.
  - Manejo de dependencias complejas como **Pandoc** en un entorno Linux.
- **Mis capacidades en frontend**:
  - Construcción de una interfaz que interactúa eficientemente con el backend.
  - Uso de **Vue 3** y **TypeScript** para desarrollar un frontend moderno.
  - Diseño limpio usando **TailwindCSS**.
- **Manejo de Docker**:
  - Creación de una imagen personalizada.
  - Despliegue de la API en un contenedor funcional y reproducible.

Aunque no me enfoco en frontend, este proyecto me permitió demostrar que puedo trabajar en ambas áreas para completar un sistema funcional de extremo a extremo.

---

## Instrucciones de Despliegue

### Backend (Docker)
1. Construir la imagen Docker:
   ```bash
   docker build -t conversor-archivos .
   ```
2. Ejecutar el contenedor:
   ```bash
   docker run -d -p 3000:3000 conversor-archivos
   ```

### Frontend
1. Clonar el repositorio y navegar al directorio del frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Acceder al frontend en `http://localhost:5173`.

---

## ¿Qué aprendí?

Este proyecto fue un desafío interesante y me permitió:
- Perfeccionar mis habilidades en **Node.js** y manejo de archivos.
- Aprender más sobre **Vue 3** y **TypeScript** para crear una interfaz funcional.
- Fortalecer mi manejo de **Docker** para crear entornos reproducibles.
- Gestionar flujos de trabajo asíncronos complejos y asegurar que tanto el frontend como el backend trabajen juntos sin problemas.

---

## Portafolio

Si quieres saber más sobre mí y mis proyectos, visita mi portafolio:
- **[Kevin Ponce](https://kevinponcedev.xyz/)**
