import { Module } from '@nestjs/common';
import { PartidosService } from './partidos.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [PartidosService],
    exports: [PartidosService],
})
export class PartidosModule { }
