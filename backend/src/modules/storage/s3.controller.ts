import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';

@Controller('storage')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    const key = await this.s3Service.upload(file);
    const url = await this.s3Service.getPresignedUrl(key);
    return { key, url };
  }

  @Get(':key')
  async getUrl(@Param('key') key: string) {
    const url = await this.s3Service.getPresignedUrl(decodeURIComponent(key));
    return { url };
  }

  @Delete(':key')
  async delete(@Param('key') key: string) {
    await this.s3Service.delete(decodeURIComponent(key));
    return { message: 'Deleted successfully' };
  }
}
