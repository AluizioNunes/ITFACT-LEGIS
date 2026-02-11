import { Module } from '@nestjs/common';
import { AudienciasController } from './audiencias.controller';
import { AudienciasService } from './audiencias.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ imports: [PrismaModule], controllers: [AudienciasController], providers: [AudienciasService], exports: [AudienciasService] })
export class AudienciasModule { }
