import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';

import { PropositurasModule } from './proposituras/proposituras.module';
import { TramitacoesModule } from './tramitacoes/tramitacoes.module';
import { ChatModule } from './chat/chat.module';
import { DepartamentosModule } from './departamentos/departamentos.module';
import { ProtocolosModule } from './protocolos/protocolos.module';
import { LegislaturasModule } from './legislaturas/legislaturas.module';
import { VereadoresModule } from './vereadores/vereadores.module';
import { MesaDiretoraModule } from './mesa-diretora/mesa-diretora.module';
import { SessoesModule } from './sessoes/sessoes.module';
import { VotacoesModule } from './votacoes/votacoes.module';
import { PartidosModule } from './partidos/partidos.module';
import { BancadasModule } from './bancadas/bancadas.module';
import { ComissoesModule } from './comissoes/comissoes.module';

// Phase 1 — Core Legislativo
import { WorkflowModule } from './workflow/workflow.module';
import { EmendasModule } from './emendas/emendas.module';
import { PareceresModule } from './pareceres/pareceres.module';
import { VetosModule } from './vetos/vetos.module';
import { DiscussoesModule } from './discussoes/discussoes.module';
import { RedacaoFinalModule } from './redacao-final/redacao-final.module';
import { AlertasModule } from './alertas/alertas.module';
import { OrdemDoDiaModule } from './ordem-do-dia/ordem-do-dia.module';

// Phase 2 — Gestão Parlamentar
import { AudienciasModule } from './audiencias/audiencias.module';
import { LicencasModule } from './licencas/licencas.module';
import { PresencaModule } from './presenca/presenca.module';
import { DecoroModule } from './decoro/decoro.module';
import { IndicacoesModule } from './indicacoes/indicacoes.module';
import { DoelmModule } from './doelm/doelm.module';

// Phase 3 — Backend & Integrações
import { MinutasModule } from './minutas/minutas.module';
import { ArquivoModule } from './arquivo/arquivo.module';

// Phase 4 — Motor de Deduplicação Semântica (41 origens)
import { DeduplicacaoModule } from './deduplicacao/deduplicacao.module';

// Phase 5 — Funcionalidades Complementares
import { TribunaModule } from './tribuna/tribuna.module';
import { MocoesModule } from './mocoes/mocoes.module';
import { ProporcionalidadeModule } from './proporcionalidade/proporcionalidade.module';
import { LideresModule } from './lideres/lideres.module';
import { ConvocacaoModule } from './convocacao/convocacao.module';
import { LegislacaoParticipativaModule } from './legislacao-participativa/legislacao-participativa.module';
import { HonrariasModule } from './honrarias/honrarias.module';

// Phase 6 — Melhorias Finais
import { AssinaturaDigitalModule } from './assinatura-digital/assinatura-digital.module';
import { SessaoAoVivoModule } from './sessao-ao-vivo/sessao-ao-vivo.module';
import { AtasIaModule } from './atas-ia/atas-ia.module';
import { VersioningModule } from './versioning/versioning.module';
import { PortalCidadaoModule } from './portal-cidadao/portal-cidadao.module';
import { TceAmModule } from './tce-am/tce-am.module';

// Rate Limiting (#11)
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        // Rate Limiting — 60 requests/minute per IP (#11)
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 60,
        }]),

        PrismaModule,
        AuthModule,
        UsersModule,
        EventsModule,
        PropositurasModule,
        TramitacoesModule,
        ChatModule,
        DepartamentosModule,
        ProtocolosModule,
        LegislaturasModule,
        VereadoresModule,
        MesaDiretoraModule,
        SessoesModule,
        VotacoesModule,
        PartidosModule,
        BancadasModule,
        ComissoesModule,

        // Phase 1 — Core Legislativo
        WorkflowModule,
        EmendasModule,
        PareceresModule,
        VetosModule,
        DiscussoesModule,
        RedacaoFinalModule,
        AlertasModule,
        OrdemDoDiaModule,

        // Phase 2 — Gestão Parlamentar
        AudienciasModule,
        LicencasModule,
        PresencaModule,
        DecoroModule,
        IndicacoesModule,
        DoelmModule,

        // Phase 3 — Backend & Integrações
        MinutasModule,
        ArquivoModule,

        // Phase 4 — Motor de Deduplicação Semântica (41 origens)
        DeduplicacaoModule,

        // Phase 5 — Funcionalidades Complementares
        TribunaModule,
        MocoesModule,
        ProporcionalidadeModule,
        LideresModule,
        ConvocacaoModule,
        LegislacaoParticipativaModule,
        HonrariasModule,

        // Phase 6 — Melhorias Finais
        AssinaturaDigitalModule,
        SessaoAoVivoModule,
        AtasIaModule,
        VersioningModule,
        PortalCidadaoModule,
        TceAmModule,
    ],

    controllers: [AppController],
    providers: [
        AppService,
        // Global rate limit guard (#11)
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule { }
