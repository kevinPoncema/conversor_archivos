<template>
    <div class="converted-files-list">
      <h2 class="text-lg font-semibold mb-4">Archivos Convertidos</h2>
      <ul class="divide-y divide-gray-200">
        <transition-group name="fade" tag="ul">
          <li
            v-for="file in files"
            :key="file.id"
            class="flex items-center justify-between py-3"
          >
            <!-- Icono y nombre del archivo -->
            <div class="flex items-center space-x-4">
              <div class="text-purple-500 text-2xl">
                <i v-if="file.isPending" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-file-alt"></i>
              </div>
              <span class="text-gray-700 font-medium truncate">{{ file.name }}</span>
            </div>
  
            <!-- Extensión y tamaño -->
            <div class="flex items-center space-x-4">
              <span class="text-gray-500 text-sm">
                {{ file.destinationExtension.toUpperCase() }} / {{ file.size }}
              </span>
            </div>
  
            <!-- Link de estado -->
            <div>
              <a
                v-if="file.isPending"
                class="text-blue-500 hover:underline cursor-default"
              >
                Procesando...
              </a>
              <a
                v-else
                :href="file.downloadLink"
                target="_blank"
                class="text-green-500 hover:underline"
              >
                Descargar
              </a>
            </div>
          </li>
        </transition-group>
      </ul>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { PropType, defineProps, defineEmits, watch } from "vue";
  import { ConvertedFile } from "../types/types"; // Importa la interfaz del archivo
  
  // Propiedad para recibir la lista de archivos
  const props = defineProps({
    files: {
      type: Array as PropType<ConvertedFile[]>,
      required: true,
    },
  });
  
  // Emite eventos hacia el componente padre
  const emit = defineEmits(["remove-file"]);
  
  // Método para iniciar un temporizador para cada archivo
  const startFileTimer = (fileId: string) => {
    setTimeout(() => {
      emit("remove-file", fileId); // Emite el ID del archivo a eliminar
    }, 38 * 60 * 1000 ); // 38 minuto en ms
  };
  
  // Observa los cambios en la lista de archivos
  watch(
    () => props.files,
    (newFiles) => {
      newFiles.forEach((file) => {
        startFileTimer(file.id);
      });
    },
    { immediate: true, deep: true } // Observa inmediatamente y en profundidad
  );
  </script>
  
  <style>
  .converted-files-list {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  