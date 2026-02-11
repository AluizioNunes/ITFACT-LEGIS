import { Module } from '@nestjs/common';
import { VereadoresService } from './vereadores.service';
import { VereadoresController } from './vereadores.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [VereadoresController],
    providers: [VereadoresService],
    exports: [VereadoresService],
})
export class VereadoresModule { }
