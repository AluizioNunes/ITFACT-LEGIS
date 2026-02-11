import { Module } from '@nestjs/common';
import { AtasIaService } from './atas-ia.service';
import { AtasIaController } from './atas-ia.controller';

@Module({
    controllers: [AtasIaController],
    providers: [AtasIaService],
    exports: [AtasIaService],
})
export class AtasIaModule { }
