# 🚀 **Proyecto de Conversión de Archivos**

Este proyecto fue desarrollado como una **prueba técnica** para demostrar mis habilidades en el desarrollo **backend**, mi especialidad, y mi capacidad para construir un **frontend funcional**, a pesar de no ser mi enfoque principal. El resultado es un sistema sólido que permite la conversión eficiente de archivos en distintos formatos.

---

## 🎯 **Propósito del Proyecto**

El objetivo principal de este proyecto fue demostrar mi capacidad para:
- **Backend:** Desarrollar una **API robusta** para la conversión de archivos.
- **Frontend:** Crear una interfaz funcional e intuitiva para interactuar con la API.
- **Procesos Asíncronos:** Gestionar operaciones de larga duración de manera eficiente.
- **Despliegue con Docker:** Crear una imagen personalizada con dependencias específicas.

---

## 🛠️ **Características del Proyecto**

- **Conversión de Archivos:**
   - Soporte para múltiples formatos (imágenes, documentos, hojas de cálculo y marcado).
   - Uso de librerías especializadas para conversiones precisas y eficientes.
- **API Documentada:**
   - Documentación interactiva con **Swagger** para facilitar la exploración y prueba de endpoints.
- **Frontend Funcional:**
   - Interfaz desarrollada con **Vue 3** y **TypeScript**.
   - Diseño moderno con **TailwindCSS**.
- **Despliegue con Docker:**
   - Backend encapsulado en un contenedor Docker personalizado.
   - Dependencias como **Node.js** y **Pandoc** para conversiones avanzadas en Linux.

---

## 🌐 **Links de Prueba**
- **API:** [Documentación Swagger](https://api-converter.kevinponcedev.xyz/api-docs/#/)
- **Frontend:** [Interfaz Web](https://file-converter.kevinponcedev.xyz/)

---

## 💻 **Tecnologías Utilizadas**

### **Backend**
- **Node.js:** Plataforma principal para manejar solicitudes y lógica de conversión.
- **Pandoc:** Conversión avanzada de documentos en Linux.
- **Swagger:** Documentación interactiva de la API.

### **Frontend**
- **Vue 3:** Framework moderno para el desarrollo del frontend.
- **TypeScript:** Tipado estático para un código más robusto.
- **TailwindCSS:** Diseño limpio y modular.

### **Despliegue**
- **Docker:**
   - Imagen personalizada basada en **Node.js**.
   - Configuración de dependencias necesarias como **Pandoc**.
   - Contenedor reproducible y aislado.

---

## ⚙️ **Funcionalidades Clave**

- **Subida de Archivos:** Permite cargar archivos para su conversión en múltiples formatos.
- **Procesos Asíncronos:** Indicadores en tiempo real para conversiones de larga duración.
- **Eliminación Automática:** Limpieza automática de archivos temporales tras su descarga.
- **Frontend Intuitivo:** Selección de formatos, estado del proceso y descarga de resultados.
- **Despliegue Dockerizado:** Garantiza consistencia y facilidad en el despliegue.

---

## 👤 **Mi Rol en el Proyecto**

- **Backend:**
   - Diseño y desarrollo de una API robusta.
   - Manejo eficiente de archivos y procesos asíncronos.
- **Frontend:**
   - Desarrollo de una interfaz funcional con **Vue 3** y **TypeScript**.
   - Diseño moderno utilizando **TailwindCSS**.
- **Despliegue:**
   - Creación de una imagen Docker personalizada.
   - Gestión de dependencias complejas en un entorno Linux.

Este proyecto refleja mi capacidad para abordar desafíos tanto en **backend** como en **frontend**, logrando un sistema funcional y eficiente.

---

## 📦 **Instrucciones de Despliegue**

### **Backend (Docker)**
1. Construir la imagen Docker:
   ```bash
   docker build -t conversor-archivos .
   ```
2. Ejecutar el contenedor:
   ```bash
   docker run -d -p 3000:3000 conversor-archivos
   ```

### **Frontend**
1. Clonar el repositorio y navegar al directorio del frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Acceder al frontend en `http://localhost:5173`.

---

## 📚 **Lecciones Aprendidas**

- Perfeccioné mis habilidades en **Node.js** y manejo eficiente de archivos.
- Aprendí más sobre el desarrollo frontend con **Vue 3** y **TypeScript**.
- Fortalecí mi conocimiento en el despliegue de aplicaciones con **Docker**.
- Gestioné flujos de trabajo complejos y procesos asíncronos con éxito.

---

## 🌟 **Portafolio**

Si deseas conocer más sobre mí y mis proyectos, visita:
- **[Kevin Ponce](https://kevinponcedev.xyz/)**

¡Gracias por tu interés en mi trabajo! 🚀✨
