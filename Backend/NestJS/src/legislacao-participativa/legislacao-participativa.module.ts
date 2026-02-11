import { Module } from '@nestjs/common';
import { LegislacaoParticipativaService } from './legislacao-participativa.service';
import { LegislacaoParticipativaController } from './legislacao-participativa.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ imports: [PrismaModule], controllers: [LegislacaoParticipativaController], providers: [LegislacaoParticipativaService], exports: [LegislacaoParticipativaService] })
export class LegislacaoParticipativaModule { }
