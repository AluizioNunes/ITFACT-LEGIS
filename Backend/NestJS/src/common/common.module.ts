import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MinioService } from './minio.service';
import { UploadController } from './upload.controller';

@Module({
    imports: [ConfigModule],
    controllers: [UploadController],
    providers: [MinioService],
    exports: [MinioService],
})
export class CommonModule { }
