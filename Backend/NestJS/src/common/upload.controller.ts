import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from './minio.service';

@Controller('upload')
export class UploadController {
    constructor(private readonly minioService: MinioService) { }

    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File, @Body('folder') folder: string) {
        // Enforce valid folders
        const targetFolder = ['parlamentares', 'partidos'].includes(folder) ? folder : 'uploads';

        const url = await this.minioService.uploadFile(file, targetFolder);
        return { url };
    }
}
