<template>
  <div class="app-container">
    <!-- Título principal -->
    <header class="text-center my-8">
      <h1 class="text-4xl font-bold text-gray-800">Conversor de Archivos</h1>
      <p class="text-gray-500">Convierte tus archivos rápidamente y sin complicaciones</p>
    </header>

    <!-- Componente para cargar archivos -->
    <FileUpload @conversion-started="handleFileConversion" @conversion-completed="handleConversionCompleted" />
<br>
    <!-- Lista de archivos convertidos -->
    <ConvertedFilesList :files="convertedFiles" @remove-file="removeFile" />
<br>
    <!-- Advertencia -->
    <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
      <p class="font-bold">Advertencia</p>
      <p>Los archivos convertidos serán eliminados automáticamente 40 minutos después de la conversión.</p>
      <p>Si abandona esta página, los archivos se perderán y no estarán disponibles para descarga.</p>
    </div>

    <!-- Footer -->
    <footer class="text-center mt-8 p-4 border-t border-gray-200">
      <p class="text-gray-600">
        Conversor de Archivos por 
        <span class="font-bold text-gray-800">Kevin Ponce</span>
      </p>
      <a href="https://kevinponcedev.xyz/" target="_blank" class="text-blue-500 hover:underline">
        Mi Portafolio
      </a>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import FileUpload from "./components/FileUpload.vue";
import ConvertedFilesList from "./components/ConvertedFilesList.vue";
import { ConvertedFile } from "./types/types"; // Importamos la interfaz

// Lista reactiva para almacenar los archivos convertidos o en proceso
const convertedFiles = ref<ConvertedFile[]>([]);

// Maneja el evento de conversión iniciada
const handleFileConversion = (fileData: {
  name: string;
  size: string;
  destinationExtension: string;
  creationDate: string;
}) => {
  const newFile: ConvertedFile = {
    id: uuidv4(),
    ...fileData,
    isPending: true,
    downloadLink: "",
  };
  convertedFiles.value.push(newFile);
};

// Maneja el evento de conversión completada
const handleConversionCompleted = ({ id, downloadLink }: { id: string; downloadLink: string }) => {
  const fileIndex = convertedFiles.value.findIndex((file) => file.id === id);
  if (fileIndex !== -1) {
    convertedFiles.value[fileIndex].isPending = false;
    convertedFiles.value[fileIndex].downloadLink = downloadLink;
  }
};

// Maneja la eliminación de un archivo después de 1 minuto
const removeFile = (id: string) => {
  convertedFiles.value = convertedFiles.value.filter((file) => file.id !== id);
};
</script>

<style>
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
