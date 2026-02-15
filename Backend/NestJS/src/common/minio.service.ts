import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService implements OnModuleInit {
    private minioClient: Minio.Client;
    private bucketName = 'itfact-legis';

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        const endPoint = this.configService.get<string>('MINIO_ENDPOINT') || 'localhost';
        const port = parseInt(this.configService.get<string>('MINIO_PORT') || '9000');
        const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY');
        const secretKey = this.configService.get<string>('MINIO_SECRET_KEY');

        // Allow 'minio' as endpoint for docker internal networking, strip protocol if present
        const cleanEndPoint = endPoint.replace('http://', '').replace('https://', '').split(':')[0];

        this.minioClient = new Minio.Client({
            endPoint: cleanEndPoint,
            port: port,
            useSSL: false,
            accessKey: accessKey,
            secretKey: secretKey,
        });

        this.ensureBucket();
    }

    async ensureBucket() {
        try {
            const exists = await this.minioClient.bucketExists(this.bucketName);
            if (!exists) {
                await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
                const policy = {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Effect: 'Allow',
                            Principal: { AWS: ['*'] },
                            Action: ['s3:GetObject'],
                            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
                        },
                    ],
                };
                await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(policy));
            }
        } catch (err) {
            console.error('Error ensuring bucket exists:', err);
        }
    }

    async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<string> {
        const timestamp = Date.now();
        const extension = file.originalname.split('.').pop();
        const fileName = `${folder}/${timestamp}.${extension}`;

        await this.minioClient.putObject(this.bucketName, fileName, file.buffer, file.size, {
            'Content-Type': file.mimetype,
        });

        // Construct public URL (assuming localhost access for now, or use configured public URL)
        // In production this might be different
        const publicUrl = `http://localhost:9000/${this.bucketName}/${fileName}`;
        return publicUrl;
    }
}
