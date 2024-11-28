export const submitFile = () => {
    if (!file.value || !selectedFormat.value) return;
  
    // Prepara los datos para enviar al servidor
    const formData = new FormData();
    formData.append("file", file.value); // Archivo seleccionado
    formData.append("outputFormat", selectedFormat.value); // Formato de salida seleccionado
  
    // Realiza la solicitud POST al servidor
    fetch("/api/convert", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          alert(`Archivo convertido a ${selectedFormat.value} exitosamente.`);
          clearFile(); // Limpia el estado tras una conversión exitosa
        } else {
          alert("Error al convertir el archivo.");
        }
      })
      .catch((err) => {
        console.error("Error en la solicitud:", err);
        alert("Error al conectar con el servidor.");
      });
  };