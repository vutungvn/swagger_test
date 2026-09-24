// src/upload/upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  @Post('image')
  @ApiOperation({ summary: 'Upload 1 file ảnh' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }
}
