import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Response,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Get('/:uuid')
  async getFile(@Param('uuid') uuid: string, @Response() res): Promise<void> {
    const fileDoc = await this.fileService.find(uuid);
    if (!fileDoc) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const file = createReadStream(join(process.cwd(), fileDoc.path));
    res.set({
      'Content-Type': fileDoc.mimetype,
      'Content-Disposition': `attachment; filename="${fileDoc.originalname}"`,
    });
    file.pipe(res);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, _file, cb) => {
          cb(null, randomUUID());
        },
      }),
    }),
  )
  postFile(@UploadedFile() file): Promise<string> {
    return this.fileService.create(file);
  }
}
