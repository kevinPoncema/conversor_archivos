# Usa la última versión estable de Node.js
FROM node:current

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /frontend

# Copia todos los archivos de /frontend desde el host al contenedor
COPY ./frontend/ .

# Instala las dependencias
RUN npm install

# Expone el puerto 3000 (puedes cambiarlo si usas otro en tu app)
EXPOSE 3000

# Comando para iniciar la app en modo desarrollo
CMD ["npm", "run", "serve"]
