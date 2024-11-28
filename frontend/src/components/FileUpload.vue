<template>
  <div class="flex flex-col items-center justify-center bg-gray-100 text-gray-900 rounded-lg p-6 shadow-lg w-full max-w-lg mx-auto">
    <!-- Bloque para cargar un archivo -->
    <div v-if="!file" class="w-full">
      <div
        class="border-4 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-500"
        @dragover.prevent
        @dragenter.prevent
        @drop.prevent="handleDrop"
      >
        <!-- Área para arrastrar o seleccionar archivo -->
        <label for="fileInput" class="cursor-pointer">
          <p class="text-lg font-semibold">Seleccione un archivo</p>
          <div class="flex justify-center space-x-4 mt-4">
            <i class="fas fa-folder-open text-3xl text-purple-500"></i>
            <i class="fas fa-cloud-upload-alt text-3xl text-purple-500"></i>
          </div>
          <p class="text-sm text-gray-400 mt-2">O arrastre y suelte aquí.</p>
        </label>
        <input
          id="fileInput"
          type="file"
          :accept="acceptFormats"
          class="hidden"
          @change="handleFileSelect"
        />
      </div>
    </div>

    <!-- Bloque que muestra detalles del archivo seleccionado -->
    <div v-else class="w-full">
      <div class="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
        <!-- Nombre y tipo del archivo -->
        <div class="flex items-center space-x-4">
          <i class="fas fa-file text-purple-500 text-2xl"></i>
          <span class="text-sm font-semibold truncate">{{ file?.name }}</span>
        </div>
        <!-- Opciones: formato de salida, tamaño y eliminar archivo -->
        <div class="flex items-center space-x-4">
          <!-- Selector de formato de salida -->
          <select
            v-model="selectedFormat"
            class="border rounded-md p-2 bg-gray-50 focus:outline-none"
          >
            <option v-for="format in outputFormats" :key="format" :value="format">
              {{ format }}
            </option>
          </select>
          <!-- Muestra el tamaño del archivo -->
          <span class="text-sm text-gray-500">{{ formatSize(file?.size || 0) }}</span>
          <!-- Botón para eliminar el archivo -->
          <button
            class="text-red-500 hover:text-red-700 focus:outline-none"
            @click="clearFile"
          >
            ❌
          </button>
        </div>
      </div>
    </div>

    <!-- Botón para convertir el archivo -->
    <button
      v-if="file"
      class="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg mt-4 w-full disabled:opacity-50"
      :disabled="!file || !selectedFormat"
      @click="submitFile"
    >
      Convertir a {{ selectedFormat }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
// Importa configuraciones externas con formatos y conversiones válidas
import { allowFormats, validConversions, GeneralFormats, ImageFormats, MarkupFormats,SpreadsheetFormats } from "../types/types"; 

import {submitFile} from "../services/convertApi;"
// Variables reactivas para el estado del componente
const file = ref<File | null>(null); // Archivo seleccionado
const selectedFormat = ref<string>(""); // Formato seleccionado para la conversión
const outputFormats = ref<string[]>([]); // Formatos disponibles para la conversión
// Computa los formatos aceptados como string para el input
const acceptFormats = computed(() => {
  // Combina todos los formatos desde `allowFormats`
  const allFormats = [
    ...allowFormats.images.map((format) => `.${format}`),
    ...allowFormats.markup.map((format) => `.${format}`),
    ...allowFormats.spreadsheets.map((format) => `.${format}`),
    ...allowFormats.general.map((format) => `.${format}`),
  ];

  // Elimina duplicados utilizando un conjunto (`Set`)
  const uniqueFormats = Array.from(new Set(allFormats));

  // Devuelve los formatos como una cadena separada por comas
  return uniqueFormats.join(",");
});
// Método: Maneja la selección de archivo desde el input
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    validateAndAddFile(input.files[0]); // Valida y agrega el archivo seleccionado
  }
};

// Método: Maneja el archivo arrastrado y soltado
const handleDrop = (event: DragEvent) => {
  if (event.dataTransfer && event.dataTransfer.files[0]) {
    validateAndAddFile(event.dataTransfer.files[0]); // Valida y agrega el archivo arrastrado
  }
};

// Método: Valida el formato del archivo y actualiza el estado
const validateAndAddFile = (selectedFile: File) => {
  const fileExtension = getFileExtension(selectedFile.name); // Obtiene la extensión del archivo
  if (isValidFormat(fileExtension)) {
    file.value = selectedFile; // Guarda el archivo en el estado
    fetchOutputFormats(fileExtension); // Genera los formatos de salida dinámicamente
  } else {
    alert(`Formato de archivo no válido: .${fileExtension}`);
  }
};

const fetchOutputFormats = (inputFormat: string) => {
  // Verifica si el formato pertenece a imágenes
  if (Object.values(ImageFormats).includes(inputFormat as ImageFormats)) {
    // Filtra todos los formatos de imágenes excepto el formato actual
    outputFormats.value = Object.values(ImageFormats).filter(
      (format) => format !== inputFormat
    );
  } 
  // Verifica si el formato pertenece a marcado
  else if (Object.values(MarkupFormats).includes(inputFormat as MarkupFormats)) {
    // Filtra todos los formatos de marcado excepto el formato actual
    outputFormats.value = Object.values(MarkupFormats).filter(
      (format) => format !== inputFormat
    );
  } 
  // Verifica si el formato pertenece a hojas de cálculo
  else if (Object.values(SpreadsheetFormats).includes(inputFormat as SpreadsheetFormats)) {
    // Filtra todos los formatos de hojas de cálculo excepto el formato actual
    outputFormats.value = Object.values(SpreadsheetFormats).filter(
      (format) => format !== inputFormat
    );
  } 
  // Verifica si el formato pertenece a los formatos generales
  else if (Object.keys(validConversions).includes(inputFormat as GeneralFormats)) {
    // Usa las conversiones válidas definidas en `validConversions`
    outputFormats.value = validConversions[inputFormat as GeneralFormats] || [];
  } 
  // Si no pertenece a ninguno de los casos válidos, deja vacío `outputFormats`
  else {
    outputFormats.value = [];
  }

  // Selecciona el primer formato como predeterminado si existen opciones
  selectedFormat.value = outputFormats.value.length > 0 ? outputFormats.value[0] : "";
  console.log("Output formats:", outputFormats.value);
};


// Método: Limpia el archivo seleccionado y reinicia el estado
const clearFile = () => {
  file.value = null;
  selectedFormat.value = "";
  outputFormats.value = [];
};

// Método: Formatea el tamaño del archivo para mostrarlo en KB o MB
const formatSize = (size: number) => {
  const kb = size / 1024;
  const mb = kb / 1024;
  return mb >= 1 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(2)} KB`;
};

// Método: Envía el archivo y el formato al servidor para la conversión


// Utilidades: Verifica si el formato del archivo es válido
const isValidFormat = (extension: string): boolean => {
  // Itera sobre las categorías de `allowFormats` y verifica si el formato pertenece a alguna
  return Object.values(allowFormats).some((formats) =>
    formats.includes(extension)
  );
};


// Utilidades: Extrae la extensión del archivo a partir de su nombre
const getFileExtension = (fileName: string): string => {
  return fileName.split(".").pop()?.toLowerCase() || ""; // Obtiene la última parte tras el punto
};
</script>

<style>
/* Font Awesome para íconos */
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");
</style>
