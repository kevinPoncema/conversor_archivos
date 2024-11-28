// Enums para definir los formatos de archivo válidos
export enum ImageFormats {
  JPG = "jpg",
  JPEG = "jpeg",
  PNG = "png",
  WEBP = "webp",
  TIFF = "tiff",
}

export enum MarkupFormats {
  HTML = "html",
  MD = "md",
}

export enum SpreadsheetFormats {
  XLSX = "xlsx",
  XLS = "xls",
  CSV = "csv",
}

export enum GeneralFormats {
  MARKDOWN = "markdown",
  HTML = "html",
  EPUB = "epub",
  DOCX = "docx",
  ODT = "odt",
  RTF = "rtf",
  TEX = "tex",
  PLAIN = "plain",
  JUPYTER = "jupyter",
  PDF = "pdf",
}

// Estructura de conversiones válidas usando un Record
export const validConversions: Record<GeneralFormats, GeneralFormats[]> = {
  [GeneralFormats.MARKDOWN]: [
    GeneralFormats.HTML,
    GeneralFormats.EPUB,
    GeneralFormats.DOCX,
    GeneralFormats.PDF,
    GeneralFormats.ODT,
    GeneralFormats.RTF,
    GeneralFormats.TEX,
    GeneralFormats.PLAIN,
    GeneralFormats.JUPYTER,
  ],
  [GeneralFormats.HTML]: [
    GeneralFormats.MARKDOWN,
    GeneralFormats.PDF,
    GeneralFormats.EPUB,
    GeneralFormats.DOCX,
    GeneralFormats.ODT,
    GeneralFormats.RTF,
    GeneralFormats.JUPYTER,
  ],
  [GeneralFormats.EPUB]: [GeneralFormats.HTML, GeneralFormats.PDF, GeneralFormats.MARKDOWN],
  [GeneralFormats.DOCX]: [GeneralFormats.MARKDOWN, GeneralFormats.HTML, GeneralFormats.PDF, GeneralFormats.ODT],
  [GeneralFormats.ODT]: [GeneralFormats.DOCX, GeneralFormats.PDF, GeneralFormats.HTML, GeneralFormats.MARKDOWN],
  [GeneralFormats.RTF]: [GeneralFormats.DOCX, GeneralFormats.PDF, GeneralFormats.HTML],
  [GeneralFormats.TEX]: [GeneralFormats.PDF, GeneralFormats.HTML],
  [GeneralFormats.PLAIN]: [GeneralFormats.MARKDOWN],
  [GeneralFormats.JUPYTER]: [GeneralFormats.MARKDOWN, GeneralFormats.HTML],
  [GeneralFormats.PDF]: [], // PDF no tiene formatos de salida válidos
};

// Formatos válidos para imágenes, marcado, hojas de cálculo y formatos generales
export const allowFormats = {
  images: [
    ImageFormats.JPG,
    ImageFormats.JPEG,
    ImageFormats.PNG,
    ImageFormats.WEBP,
    ImageFormats.TIFF,
  ],
  markup: [MarkupFormats.HTML, MarkupFormats.MD],
  spreadsheets: [
    SpreadsheetFormats.XLSX,
    SpreadsheetFormats.XLS,
    SpreadsheetFormats.CSV,
  ],
  general: Object.values(GeneralFormats), // Agregamos los formatos generales
};

