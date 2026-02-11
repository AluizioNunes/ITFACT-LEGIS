import { Module } from '@nestjs/common';
import { LegislaturasService } from './legislaturas.service';
import { LegislaturasController } from './legislaturas.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [LegislaturasController],
    providers: [LegislaturasService],
    exports: [LegislaturasService],
})
export class LegislaturasModule { }
