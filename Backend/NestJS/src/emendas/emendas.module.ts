import { Module } from '@nestjs/common';
import { EmendasController } from './emendas.controller';
import { EmendasService } from './emendas.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [EmendasController],
    providers: [EmendasService],
    exports: [EmendasService],
})
export class EmendasModule { }
