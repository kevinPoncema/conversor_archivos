// Archivo: src/services/convertApi.ts

export const convertRequest = (file: File, selectedFormat: string): Promise<{ downloadLink: string }> => {
    if (!file || !selectedFormat) {
      return Promise.reject("Archivo o formato no proporcionado");
    }
  
    return new Promise((resolve) => {
      // Simula un retraso de 20 segundos
      setTimeout(() => {
        const hypotheticalLink = `https://example.com/download/${file.name}.${selectedFormat}`;
        resolve({ downloadLink: hypotheticalLink });
      }, 20000); // 20 segundos
    });
  };
  