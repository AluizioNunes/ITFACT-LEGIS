import { Module } from '@nestjs/common';
import { BancadasService } from './bancadas.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [BancadasService],
    exports: [BancadasService],
})
export class BancadasModule { }
