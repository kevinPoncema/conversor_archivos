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
import { ref, computed,defineEmits } from "vue";
import { allowFormats, validConversions, GeneralFormats, ImageFormats, MarkupFormats, SpreadsheetFormats } from "../types/types";
import { convertRequest } from "../services/convertApi"; // Importa la función abstracta
import { v4 as uuidv4 } from "uuid";

// Variables reactivas para el estado del componente
const file = ref<File | null>(null); // Archivo seleccionado
const selectedFormat = ref<string>(""); // Formato seleccionado para la conversión
const outputFormats = ref<string[]>([]); // Formatos disponibles para la conversión

// Computa los formatos aceptados como string para el input
const acceptFormats = computed(() => {
  const allFormats = [
    ...allowFormats.images.map((format) => `.${format}`),
    ...allowFormats.markup.map((format) => `.${format}`),
    ...allowFormats.spreadsheets.map((format) => `.${format}`),
    ...allowFormats.general.map((format) => `.${format}`),
  ];
  return Array.from(new Set(allFormats)).join(","); // Elimina duplicados y genera una cadena
});

// Métodos: Manejo de archivo
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    validateAndAddFile(input.files[0]);
  }
};

const handleDrop = (event: DragEvent) => {
  if (event.dataTransfer && event.dataTransfer.files[0]) {
    validateAndAddFile(event.dataTransfer.files[0]);
  }
};

const validateAndAddFile = (selectedFile: File) => {
  const fileExtension = getFileExtension(selectedFile.name);
  if (isValidFormat(fileExtension)) {
    file.value = selectedFile;
    fetchOutputFormats(fileExtension); // Genera formatos de salida
  } else {
    alert(`Formato de archivo no válido: .${fileExtension}`);
  }
};

const fetchOutputFormats = (inputFormat: string) => {
  if (Object.values(ImageFormats).includes(inputFormat as ImageFormats)) {
    outputFormats.value = Object.values(ImageFormats).filter((format) => format !== inputFormat);
  } else if (Object.values(MarkupFormats).includes(inputFormat as MarkupFormats)) {
    outputFormats.value = Object.values(MarkupFormats).filter((format) => format !== inputFormat);
  } else if (Object.values(SpreadsheetFormats).includes(inputFormat as SpreadsheetFormats)) {
    outputFormats.value = Object.values(SpreadsheetFormats).filter((format) => format !== inputFormat);
  } else if (Object.keys(validConversions).includes(inputFormat as GeneralFormats)) {
    outputFormats.value = validConversions[inputFormat as GeneralFormats] || [];
  } else {
    outputFormats.value = [];
  }
  selectedFormat.value = outputFormats.value.length > 0 ? outputFormats.value[0] : "";
};

const clearFile = () => {
  file.value = null;
  selectedFormat.value = "";
  outputFormats.value = [];
};

const formatSize = (size: number) => {
  const kb = size / 1024;
  const mb = kb / 1024;
  return mb >= 1 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(2)} KB`;
};
const emit = defineEmits(["conversion-started","conversion-completed"]);

const submitFile = async () => {
  if (!file.value || !selectedFormat.value) {
    alert("Por favor, seleccione un archivo y un formato.");
    return;
  }

  // Genera un ID único para este archivo
  const id = uuidv4();

  // Emite un evento con los datos del archivo antes de la conversión
  const conversionData = {
    id, // ID único
    name: file.value.name,
    size: formatSize(file.value.size),
    destinationExtension: selectedFormat.value,
    creationDate: new Date().toISOString(), // Fecha actual
  };
  emit("conversion-started", conversionData);

  try {
    let dowloadLink =await convertRequest(file.value, selectedFormat.value);

    // Actualiza el archivo en la lista del componente padre (puedes emitir otro evento si es necesario)
    emit("conversion-completed", { id, downloadLink: dowloadLink });
    //alert(`Archivo convertido a ${selectedFormat.value} exitosamente.`);
    clearFile();
  } catch (error) {
    alert(error instanceof Error ? error.message : "Error inesperado.");
  }
};


// Utilidades
const isValidFormat = (extension: string): boolean => {
  return Object.values(allowFormats).some((formats) => formats.includes(extension));
};

const getFileExtension = (fileName: string): string => {
  return fileName.split(".").pop()?.toLowerCase() || "";
};
</script>

<style>
/* Font Awesome para íconos */
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");
</style>
