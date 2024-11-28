import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { ConversionValidator } from "../validators/ConversionValidator.js";

export class PandocController {
  // Método estático para obtener los formatos compatibles
  static getCompatibleFormats() {
    return ConversionValidator.prototype.validConversions;
  }

  // Método estático para realizar la conversión usando Pandoc
  static async convertFile(inputPath, outputPath, inputFormat, outputFormat) {
    const command = `pandoc -f ${inputFormat} -t ${outputFormat} "${inputPath}" -o "${outputPath}"`;
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error("Error durante la conversión:", stderr);
          reject(error);
        } else {
          console.log("Conversión exitosa:", stdout);
          resolve(outputPath);
        }
      });
    });
  }

  // Método estático para manejar solicitudes de la API
  static async handleConversionRequest(req, res) {
    const { outputFormat } = req.body; // Obtener formato de salida del cuerpo de la solicitud
    const { file } = req; // Obtener archivo subido

    if (!file) {
      return res.status(400).json({ error: "No se proporcionó ningún archivo." });
    }

    // Determinar el formato de entrada a partir de la extensión del archivo
    const inputFormat = path.extname(file.originalname).substring(1); // Ejemplo: "markdown"

    // Validar la conversión
    if (!ConversionValidator.isValidConversion(inputFormat, outputFormat)) {
      return res.status(400).json({
        error: `No se puede convertir de ${inputFormat} a ${outputFormat}.`,
        compatibleFormats: PandocController.getCompatibleFormats(),
      });
    }

    // Crear carpeta de salida si no existe
    const outputDir = path.resolve("convert");
    try {
      await fs.mkdir(outputDir, { recursive: true });
    } catch (err) {
      console.error(`Error al crear el directorio de salida: ${err.message}`);
      return res.status(500).json({ error: "Error al preparar el directorio de salida." });
    }

    // Ruta de salida para el archivo convertido
    const baseName = path.basename(file.originalname, path.extname(file.originalname));
    const outputFileName = `${baseName}-converted.${outputFormat}`;
    const outputFilePath = path.join(outputDir, outputFileName);

    try {
      // Convertir el archivo
      await PandocController.convertFile(file.path, outputFilePath, inputFormat, outputFormat);

      // Eliminar el archivo original
      await fs.unlink(file.path);

      // Programar la eliminación del archivo convertido después de 40 minutos
      setTimeout(async () => {
        try {
          await fs.unlink(outputFilePath);
          console.log(`Archivo eliminado automáticamente: ${outputFilePath}`);
        } catch (err) {
          console.error(`Error al eliminar el archivo convertido: ${err.message}`);
        }
      }, 40 * 60 * 1000);

      // Responder con la ruta del archivo convertido
      res.json({ success: true, convertedFilePath: outputFilePath });
    } catch (error) {
      console.error("Error durante la conversión:", error);
      res.status(500).json({ error: "Error durante la conversión del archivo." });
    }
  }
}
