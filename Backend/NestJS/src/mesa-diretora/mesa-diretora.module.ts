import { Module } from '@nestjs/common';
import { MesaDiretoraService } from './mesa-diretora.service';
import { MesaDiretoraController } from './mesa-diretora.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [MesaDiretoraController],
    providers: [MesaDiretoraService],
    exports: [MesaDiretoraService],
})
export class MesaDiretoraModule { }
