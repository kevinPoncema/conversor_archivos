<template>
    <div class="app-container">
      <!-- Componente para cargar archivos -->
      <FileUpload @conversion-started="handleFileConversion" @conversion-completed="handleConversionCompleted" />
  
      <!-- Lista de archivos convertidos -->
      <ConvertedFilesList :files="convertedFiles" />
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
  </script>
  
  <style>
  .app-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  </style>
  