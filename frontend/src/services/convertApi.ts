import { apiResponse, ImageFormats, MarkupFormats, SpreadsheetFormats, GeneralFormats, allowFormats } from "../types/types";

const baseURL = "http://localhost:3000"; // Base URL para las solicitudes

/**
 * Función para determinar la ruta de la API según el tipo de archivo
 */
const getApiEndpoint = (inputFormat: string, outputFormat: string): string | null => {
  if (Object.values(ImageFormats).includes(inputFormat as ImageFormats)) {
    return "/convert-image";
  } else if (Object.values(MarkupFormats).includes(inputFormat as MarkupFormats)) {
    return "/convert-html-md";
  } else if (Object.values(SpreadsheetFormats).includes(inputFormat as SpreadsheetFormats)) {
    return "/convert-xlsx";
  } else if (Object.values(GeneralFormats).includes(inputFormat as GeneralFormats)) {
    return "/convert-document";
  }
  return null; // Retorna null si el formato no es válido
};

/**
 * Función para realizar la solicitud al servidor
 */
const sendRequestToApi = async (url: string, file: File, inputFormat: string, outputFormat: string): Promise<apiResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("inputFormat", inputFormat);
  formData.append("outputFormat", outputFormat);

  const response = await fetch(`${baseURL}${url}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error al realizar la conversión. Código de estado: ${response.status}`);
  }

  // Procesa la respuesta JSON
  const responseData: apiResponse = await response.json();

  // Modifica filePath para que incluya baseURL
  responseData.filePath = `${baseURL}${responseData.filePath}`;

  return responseData;
};


/**
 * Función principal para manejar la conversión según los formatos de entrada y salida
 */
export const convertRequest = async (file: File, selectedFormat: string, inputFormat: string): Promise<apiResponse> => {
  if (!file || !selectedFormat || !inputFormat) {
    return Promise.reject("Archivo, formato de entrada o formato de salida no proporcionado.");
  }

  // Determinar el endpoint de la API según el tipo de archivo
  const apiEndpoint = getApiEndpoint(inputFormat, selectedFormat);

  if (!apiEndpoint) {
    return Promise.reject(`El formato de entrada ${inputFormat} no es válido o no es soportado.`);
  }

  // Realizar la solicitud a la API correspondiente
  try {
    return await sendRequestToApi(apiEndpoint, file, inputFormat, selectedFormat);
  } catch (error) {
    throw new Error(`Error al realizar la conversión: ${error}`);
  }
};
