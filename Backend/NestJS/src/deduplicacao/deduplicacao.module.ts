import { Module } from '@nestjs/common';
import { DeduplicacaoService } from './deduplicacao.service';
import { DeduplicacaoController } from './deduplicacao.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [DeduplicacaoController],
    providers: [DeduplicacaoService],
    exports: [DeduplicacaoService],
})
export class DeduplicacaoModule { }
