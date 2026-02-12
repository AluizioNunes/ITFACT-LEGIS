"""
AI Legislative endpoints — classificação, constitucionalidade, pareceres, ordem do dia, atas.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

router = APIRouter(prefix="/ai", tags=["AI Legislative"])


# ── Models ──

class ProposituraAnaliseRequest(BaseModel):
    texto: str
    ementa: Optional[str] = None


class ParecerSugestaoRequest(BaseModel):
    ementa_propositura: str
    texto_propositura: str
    comissao_nome: str
    tipo_parecer: str  # CONSTITUCIONALIDADE, MERITO, FINANCEIRO


class OrdemDiaRequest(BaseModel):
    proposicoes: List[dict]


class AtaRequest(BaseModel):
    resumo_sessao: str
    votacoes: Optional[List[dict]] = None
    presencas: Optional[List[str]] = None


# ── Endpoints ──

@router.post("/propositura/classificar")
async def classificar_propositura(request: ProposituraAnaliseRequest):
    """Classifica tipo e regime de tramitação usando IA"""
    try:
        texto = request.texto[:3000]
        keywords = {
            "PL": ["projeto de lei", "fica criado", "fica instituído", "art.", "artigo"],
            "PLC": ["lei complementar", "complementar"],
            "PR": ["resolução", "regimento interno", "câmara municipal"],
            "PDL": ["decreto legislativo", "ratificar", "sustar"],
            "EMENDA_LOMAN": ["lei orgânica", "emenda", "constituição"],
            "INDICACAO": ["indica", "indicação", "solicita ao executivo"],
            "REQUERIMENTO": ["requer", "requerimento", "solicita informações"],
            "MOCAO": ["moção", "solidariedade", "repúdio", "congratulações"],
        }

        scores = {}
        texto_lower = texto.lower()
        for tipo, words in keywords.items():
            score = sum(1 for w in words if w in texto_lower)
            scores[tipo] = score

        tipo_classificado = max(scores, key=scores.get)

        regime = "ORDINARIO"
        if any(w in texto_lower for w in ["urgência", "urgente", "caráter urgente"]):
            regime = "URGENCIA"
        elif any(w in texto_lower for w in ["prazo", "executivo", "poder executivo encaminha"]):
            regime = "PRAZO_FATAL"

        first_sentences = ". ".join(texto.split(".")[:3]) + "."

        return {
            "tipo_classificado": tipo_classificado,
            "regime_sugerido": regime,
            "confianca": max(scores.values()) / max(sum(scores.values()), 1),
            "scores": scores,
            "sugestao_ementa": first_sentences[:200],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/propositura/analise-constitucional")
async def analise_constitucional(request: ProposituraAnaliseRequest):
    """Verifica pontos de atenção constitucional de uma propositura"""
    try:
        texto_lower = request.texto.lower()
        alertas = []

        checks = [
            ("Possível vício de iniciativa", ["o prefeito", "executivo municipal"],
             "Verificar se a matéria é de competência exclusiva do Executivo (Art. 53 LOMAN)"),
            ("Matéria orçamentária", ["despesa", "receita", "orçamento", "crédito"],
             "Projetos que implicam despesa requerem fonte de custeio (Art. 65 LOMAN)"),
            ("Servidores públicos", ["servidor", "vencimentos", "remuneração", "cargo"],
             "Matéria de servidores pode ser de iniciativa privativa do Executivo (Art. 53 §1)"),
            ("Organização administrativa", ["secretaria", "departamento", "órgão"],
             "Criação de órgãos é de competência do Executivo (Art. 69 LOMAN)"),
            ("Matéria tributária", ["tributo", "imposto", "taxa", "isenção"],
             "Verificar competência tributária municipal (Art. 41 LOMAN)"),
        ]

        for titulo, palavras, detalhe in checks:
            if any(p in texto_lower for p in palavras):
                alertas.append({"titulo": titulo, "detalhe": detalhe, "severidade": "ATENCAO"})

        return {
            "alertas": alertas,
            "pontos_atencao": len(alertas),
            "recomendacao": "PROSSEGUIR" if len(alertas) < 2 else "ANALISAR_CCJ_DETALHADO",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/parecer/sugerir")
async def sugerir_parecer(request: ParecerSugestaoRequest):
    """Sugere texto de parecer baseado na matéria e tipo de comissão"""
    try:
        tipo = request.tipo_parecer
        comissao = request.comissao_nome
        ementa = request.ementa_propositura

        templates = {
            "CONSTITUCIONALIDADE": f"""PARECER DE CONSTITUCIONALIDADE

COMISSÃO: {comissao}

MATÉRIA: {ementa}

I - RELATÓRIO
A propositura em tela visa {ementa.lower()}, submetida à análise desta Comissão quanto à sua constitucionalidade, legalidade e técnica legislativa.

II - FUNDAMENTAÇÃO
Após análise, verifica-se que a propositura atende/não atende aos requisitos constitucionais e legais pertinentes, estando em conformidade/desconformidade com a Lei Orgânica do Município de Manaus.

III - VOTO DO RELATOR
Pelo exposto, opino pela CONSTITUCIONALIDADE/INCONSTITUCIONALIDADE da matéria, nos termos do art. 82 do Regimento Interno.

É o parecer.""",

            "MERITO": f"""PARECER DE MÉRITO

COMISSÃO: {comissao}

MATÉRIA: {ementa}

I - RELATÓRIO
Trata-se de propositura que visa {ementa.lower()}, encaminhada a esta Comissão para análise de mérito.

II - FUNDAMENTAÇÃO
A propositura apresenta relevância para o Município por [inserir fundamentação]. Do ponto de vista técnico, a matéria se mostra [adequada/inadequada] ao interesse público local.

III - VOTO DO RELATOR
Diante do exposto, somos pela APROVAÇÃO/REJEIÇÃO da matéria, recomendando [inserir recomendação].

É o parecer.""",

            "FINANCEIRO": f"""PARECER DE ADEQUAÇÃO FINANCEIRA E ORÇAMENTÁRIA

COMISSÃO: {comissao}

MATÉRIA: {ementa}

I - RELATÓRIO
A presente propositura, que dispõe sobre {ementa.lower()}, foi submetida a esta Comissão para análise de impacto financeiro e adequação orçamentária.

II - FUNDAMENTAÇÃO
Quanto à adequação financeiro-orçamentária, verifica-se que a propositura [implica/não implica] aumento de despesa pública. [Se implica]: A fonte de custeio indicada é [adequada/inadequada], conforme art. 65 da LOMAN.

III - VOTO DO RELATOR
Pelo exposto, opino pela ADEQUAÇÃO/INADEQUAÇÃO financeiro-orçamentária da propositura.

É o parecer.""",
        }

        return {
            "sugestao_parecer": templates.get(tipo, templates["MERITO"]),
            "tipo": tipo,
            "comissao": comissao,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ordem-dia/priorizar")
async def priorizar_ordem_dia(request: OrdemDiaRequest):
    """Prioriza proposições para Ordem do Dia conforme Regimento"""
    try:
        proposicoes = request.proposicoes
        prioridade_map = {
            "urgente": 1, "veto": 2,
            "PL": 3, "PLC": 3, "PR": 3, "PDL": 3, "EMENDA_LOMAN": 3,
            "parecer": 4, "REQUERIMENTO": 5,
            "INDICACAO": 6, "MOCAO": 6,
        }

        for p in proposicoes:
            if p.get("urgente"):
                p["prioridade_calculada"] = 1
            elif p.get("tipo") == "VETO":
                p["prioridade_calculada"] = 2
            else:
                p["prioridade_calculada"] = prioridade_map.get(p.get("tipo", ""), 7)

        ordenadas = sorted(proposicoes, key=lambda x: (x.get("prioridade_calculada", 7), x.get("data_criacao", "")))
        return {"ordem_sugerida": ordenadas, "total": len(ordenadas)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ata/gerar")
async def gerar_ata(request: AtaRequest):
    """Gera ata de sessão automaticamente"""
    try:
        resumo = request.resumo_sessao
        votacoes = request.votacoes or []
        presencas = request.presencas or []

        ata = f"""ATA DA SESSÃO

Data: {datetime.utcnow().strftime('%d/%m/%Y')}

PRESENTES: {', '.join(presencas) if presencas else '[lista de presentes]'}

RESUMO DOS TRABALHOS:
{resumo}

"""
        if votacoes:
            ata += "VOTAÇÕES REALIZADAS:\n"
            for i, v in enumerate(votacoes, 1):
                ata += f"{i}. {v.get('propositura', 'N/A')} - Resultado: {v.get('resultado', 'N/A')}\n"

        ata += "\nNada mais havendo a tratar, encerrou-se a sessão.\n"

        return {"ata_gerada": ata, "data": datetime.utcnow().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
