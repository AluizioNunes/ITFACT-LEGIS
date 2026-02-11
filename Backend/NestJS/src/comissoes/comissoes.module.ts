import { Module } from '@nestjs/common';
import { ComissoesService } from './comissoes.service';
import { ComissoesController } from './comissoes.controller';
import { ComissoesExtController } from './comissoes-ext.controller';
import { ComissoesSeedService } from './comissoes-seed.service';
import { ComissoesTemporariasService } from './comissoes-temporarias.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ComissoesController, ComissoesExtController],
    providers: [ComissoesService, ComissoesSeedService, ComissoesTemporariasService],
    exports: [ComissoesService, ComissoesSeedService, ComissoesTemporariasService],
})
export class ComissoesModule { }

