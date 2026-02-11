import { Module } from '@nestjs/common';
import { AssinaturaDigitalService } from './assinatura-digital.service';
import { AssinaturaDigitalController } from './assinatura-digital.controller';

@Module({
    controllers: [AssinaturaDigitalController],
    providers: [AssinaturaDigitalService],
    exports: [AssinaturaDigitalService],
})
export class AssinaturaDigitalModule { }
