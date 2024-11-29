# Usar la última versión estable de Node.js como base
FROM node:latest

# Actualizar el sistema e instalar herramientas necesarias
RUN apt-get update && apt-get install -y \
    wget \
    alien \
    texlive-xetex && \
    rm -rf /var/lib/apt/lists/*

# Descargar e instalar la última versión de Pandoc
RUN wget https://github.com/jgm/pandoc/releases/download/3.1.8/pandoc-3.1.8-1-amd64.deb && \
    dpkg -i pandoc-3.1.8-1-amd64.deb && \
    rm pandoc-3.1.8-1-amd64.deb

# Crear el directorio de la aplicación
WORKDIR /code

# Copiar los archivos de la carpeta "backend" al contenedor
COPY backend /code

# Instalar las dependencias de Node.js
RUN npm install

# Exponer el puerto 3000 para la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "index.js"]
