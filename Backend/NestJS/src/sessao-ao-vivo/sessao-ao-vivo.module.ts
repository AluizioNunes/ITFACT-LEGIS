import { Module } from '@nestjs/common';
import { SessaoAoVivoGateway } from './sessao-ao-vivo.gateway';

@Module({
    providers: [SessaoAoVivoGateway],
    exports: [SessaoAoVivoGateway],
})
export class SessaoAoVivoModule { }
