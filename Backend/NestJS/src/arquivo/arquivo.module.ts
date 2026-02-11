import { Module } from '@nestjs/common';
import { ArquivoService } from './arquivo.service';
import { ArquivoController } from './arquivo.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ imports: [PrismaModule], controllers: [ArquivoController], providers: [ArquivoService], exports: [ArquivoService] })
export class ArquivoModule { }
