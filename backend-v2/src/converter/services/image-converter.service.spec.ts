import { Test, TestingModule } from '@nestjs/testing';
import { ImageConverterService } from './image-converter.service';
import * as sharp from 'sharp';
import * as fs from 'fs/promises';
import { InternalServerErrorException } from '@nestjs/common';
import { ConvertImageDto } from '../dtos/convert-image.dto';

jest.mock('fs/promises');
jest.mock('sharp', () => {
  return jest.fn().mockImplementation(() => ({
    toFormat: jest.fn().mockReturnThis(),
    toFile: jest.fn().mockResolvedValue(true),
  }));
});

describe('ImageConverterService', () => {
  let service: ImageConverterService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageConverterService],
    }).compile();

    service = module.get<ImageConverterService>(ImageConverterService);
  });

  it('el servicio debe estar instanciado correctamente', () => {
    expect(service).toBeDefined();
  });

  describe('convertImage()', () => {
    it('debe convertir una imagen exitosamente y devolver las rutas correctas', async () => {
      const inputPath = 'uploads/mi-foto-vacaciones.jpg';
      const dto: ConvertImageDto = { outputFormat: 'webp' };

      const result = await service.convertImage(inputPath, dto);

      expect(sharp).toHaveBeenCalledWith(inputPath);
      expect(result.fileName).toContain('.webp');
      expect(result.filePath).toContain('/download/');
    });

    it('debe lanzar InternalServerErrorException si Sharp crashea al leer una imagen corrupta', async () => {
      (sharp as unknown as jest.Mock).mockImplementationOnce(() => ({
        toFormat: jest.fn().mockReturnThis(),
        toFile: jest.fn().mockRejectedValue(new Error('Input buffer contains unsupported image format')),
      }));

      const inputPath = 'uploads/virus-camuflado.jpg';
      const dto: ConvertImageDto = { outputFormat: 'png' };

      await expect(service.convertImage(inputPath, dto)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
