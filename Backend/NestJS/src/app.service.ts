import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'ITFACT LEGIS NestJS API',
            version: '1.0.0',
        };
    }

    getHello() {
        return {
            message: 'Welcome to ITFACT LEGIS API',
            documentation: '/api/docs',
        };
    }
}
