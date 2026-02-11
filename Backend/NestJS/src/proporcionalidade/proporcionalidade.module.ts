import { Module } from '@nestjs/common';
import { ProporcionalidadeService } from './proporcionalidade.service';
import { ProporcionalidadeController } from './proporcionalidade.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ imports: [PrismaModule], controllers: [ProporcionalidadeController], providers: [ProporcionalidadeService], exports: [ProporcionalidadeService] })
export class ProporcionalidadeModule { }
