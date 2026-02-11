import { Module } from '@nestjs/common';
import { VetosController } from './vetos.controller';
import { VetosService } from './vetos.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [VetosController],
    providers: [VetosService],
    exports: [VetosService],
})
export class VetosModule { }
