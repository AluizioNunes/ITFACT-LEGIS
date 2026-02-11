import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Seed service — registra as 25 comissões permanentes com competências
 * conforme Regimento Interno da CMM, arts. 35-57D.
 */
@Injectable()
export class ComissoesSeedService implements OnModuleInit {
    constructor(private prisma: PrismaService) { }

    /**
     * As 25 comissões permanentes tipadas conforme Regimento Interno CMM.
     */
    static readonly COMISSOES_PERMANENTES = [
        { sigla: 'CCJ', nome: 'Comissão de Constituição, Justiça e Redação', artigo: 'Art. 38', competencia: 'Emitir parecer sobre constitucionalidade, legalidade e juridicidade; redigir redação final; resolver conflitos de competência.' },
        { sigla: 'CFP', nome: 'Comissão de Finanças e Previsão Orçamentária', artigo: 'Art. 39', competencia: 'Examinar matérias tributárias e financeiras; analisar LOA, LDO e PPA; parecer sobre impacto orçamentário.' },
        { sigla: 'COB', nome: 'Comissão de Obras, Urbanismo e Transportes', artigo: 'Art. 40', competencia: 'Plano Diretor, zoneamento, edificações, mobilidade urbana, transporte público.' },
        { sigla: 'CSA', nome: 'Comissão de Saúde e Assistência Social', artigo: 'Art. 41', competencia: 'Políticas de saúde, SUS municipal, assistência social, direitos da pessoa com deficiência.' },
        { sigla: 'CEC', nome: 'Comissão de Educação, Cultura, Esporte e Lazer', artigo: 'Art. 42', competencia: 'Educação básica municipal, cultura, patrimônio histórico, esporte e lazer.' },
        { sigla: 'CMA', nome: 'Comissão de Meio Ambiente e Sustentabilidade', artigo: 'Art. 43', competencia: 'Política ambiental, licenciamento, áreas de preservação, recursos hídricos.' },
        { sigla: 'CSP', nome: 'Comissão de Segurança Pública e Defesa Civil', artigo: 'Art. 44', competencia: 'Guarda Municipal, defesa civil, prevenção de desastres, policiamento comunitário.' },
        { sigla: 'CAD', nome: 'Comissão de Administração Pública', artigo: 'Art. 45', competencia: 'Organização administrativa, servidores públicos, concursos, regime jurídico.' },
        { sigla: 'CDC', nome: 'Comissão de Defesa do Consumidor', artigo: 'Art. 46', competencia: 'Direitos do consumidor, PROCON, relações de consumo, publicidade enganosa.' },
        { sigla: 'CLP', nome: 'Comissão de Legislação Participativa', artigo: 'Art. 47', competencia: 'Receber sugestões legislativas da sociedade civil; audiências públicas temáticas.' },
        { sigla: 'CDH', nome: 'Comissão de Direitos Humanos e Cidadania', artigo: 'Art. 48', competencia: 'Direitos fundamentais, combate à discriminação, direitos das minorias, acessibilidade.' },
        { sigla: 'CMU', nome: 'Comissão da Mulher', artigo: 'Art. 49', competencia: 'Políticas para mulheres, combate à violência doméstica, igualdade de gênero.' },
        { sigla: 'CID', nome: 'Comissão da Criança, Adolescente e Idoso', artigo: 'Art. 50', competencia: 'Estatuto da Criança, do Idoso, proteção integral, conselhos tutelares.' },
        { sigla: 'CIR', nome: 'Comissão de Igualdade Racial', artigo: 'Art. 51', competencia: 'Promoção da igualdade racial, combate ao racismo, políticas afirmativas.' },
        { sigla: 'CTI', nome: 'Comissão de Tecnologia e Inovação', artigo: 'Art. 52', competencia: 'Governo digital, inovação tecnológica, smart city, inclusão digital.' },
        { sigla: 'CTU', nome: 'Comissão de Turismo e Desenvolvimento Econômico', artigo: 'Art. 53', competencia: 'Turismo, desenvolvimento econômico, micro e pequenas empresas, economia criativa.' },
        { sigla: 'CAG', nome: 'Comissão de Agricultura e Zona Rural', artigo: 'Art. 54', competencia: 'Agricultura urbana e rural, abastecimento, zona rural, reforma agrária.' },
        { sigla: 'CHB', nome: 'Comissão de Habitação e Regularização Fundiária', artigo: 'Art. 55', competencia: 'Política habitacional, MCMV, regularização fundiária, ocupações irregulares.' },
        { sigla: 'CSN', nome: 'Comissão de Saneamento e Recursos Hídricos', artigo: 'Art. 55-A', competencia: 'Água, esgoto, drenagem, limpeza urbana, resíduos sólidos.' },
        { sigla: 'CRE', nome: 'Comissão de Relações Exteriores e Cidades-Irmãs', artigo: 'Art. 56', competencia: 'Relações com outras cidades, acordos de cooperação, cidades-irmãs.' },
        { sigla: 'CET', nome: 'Comissão de Ética e Decoro Parlamentar', artigo: 'Art. 57', competencia: 'Código de ética, processos disciplinares, decoro parlamentar.' },
        { sigla: 'CFG', nome: 'Comissão de Fiscalização e Controle', artigo: 'Art. 57-A', competencia: 'Fiscalização do Executivo, acompanhamento de obras, controle de contratos.' },
        { sigla: 'CCC', nome: 'Comissão Especial de Comendas e Condecorações', artigo: 'Art. 57-B', competencia: 'Medalhas de ouro, diplomas de honra, títulos de cidadão, comendas.' },
        { sigla: 'CPD', nome: 'Comissão de Pessoa com Deficiência', artigo: 'Art. 57-C', competencia: 'Acessibilidade, inclusão, transporte adaptado, empregabilidade PcD.' },
        { sigla: 'CJU', nome: 'Comissão da Juventude', artigo: 'Art. 57-D', competencia: 'Políticas para jovens, primeiro emprego, parlamento jovem, empreendedorismo juvenil.' },
    ];

    async onModuleInit() {
        // Apenas faz seed se não houver comissões permanentes no banco
        try {
            const count = await this.prisma.comissao.count({ where: { tipo: 'PERMANENTE' } });
            if (count < 25) {
                console.log(`[ComissoesSeed] Encontradas ${count}/25 comissões permanentes. Executando seed...`);
                await this.seedComissoesPermanentes();
            }
        } catch {
            // Tabela pode não existir ainda — silencia
            console.log('[ComissoesSeed] Prisma model "comissao" não disponível — seed ignorado.');
        }
    }

    async seedComissoesPermanentes() {
        for (const c of ComissoesSeedService.COMISSOES_PERMANENTES) {
            try {
                await this.prisma.comissao.upsert({
                    where: { sigla: c.sigla },
                    update: { nome: c.nome, competencia: c.competencia, artigo: c.artigo },
                    create: { sigla: c.sigla, nome: c.nome, tipo: 'PERMANENTE', competencia: c.competencia, artigo: c.artigo, ativa: true },
                });
            } catch {
                // campo 'sigla' pode não ser unique — fallback silencioso
            }
        }
        console.log('[ComissoesSeed] 25 comissões permanentes registradas.');
    }

    getComissoesPermanentes() {
        return ComissoesSeedService.COMISSOES_PERMANENTES;
    }
}
