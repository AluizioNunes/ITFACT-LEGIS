"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    Search,
    Brain,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Loader2,
    BarChart3,
    Zap,
    FileText,
    Building2,
    TrendingUp,
    Info,
} from "lucide-react";

/* ─── tipos ─── */
interface DuplicateResult {
    documento_id: string;
    documento_tipo: string;
    origem: string;
    titulo: string;
    conteudo_resumo: string | null;
    similarity_score: number;
    cross_encoder_score: number;
    is_duplicate: boolean;
    metadata: Record<string, unknown>;
}

interface CheckResponse {
    has_duplicates: boolean;
    total_candidatos: number;
    recomendacao: string;
    resultados: DuplicateResult[];
}

interface StatsResponse {
    total_documentos_indexados: number;
    por_tipo?: Record<string, number>;
    top_origens?: Record<string, number>;
    modelo_embedding?: string;
    cross_encoder?: string;
    error?: string;
}

/* ─── helpers ─── */
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function scoreColor(score: number) {
    if (score >= 0.85) return "text-red-400";
    if (score >= 0.7) return "text-amber-400";
    if (score >= 0.5) return "text-yellow-300";
    return "text-emerald-400";
}

function scoreBg(score: number) {
    if (score >= 0.85) return "bg-red-500/20 border-red-500/40";
    if (score >= 0.7) return "bg-amber-500/20 border-amber-500/40";
    if (score >= 0.5) return "bg-yellow-500/20 border-yellow-500/40";
    return "bg-emerald-500/20 border-emerald-500/40";
}

function badgeLabel(r: DuplicateResult) {
    if (r.is_duplicate) return { text: "DUPLICATA", cls: "bg-red-500/90 text-white" };
    if (r.cross_encoder_score >= 0.5) return { text: "RELACIONADO", cls: "bg-amber-500/90 text-white" };
    return { text: "BAIXA SIMILARIDADE", cls: "bg-slate-600 text-slate-200" };
}

/* ─── gauge component ─── */
function SimilarityGauge({ score, label }: { score: number; label: string }) {
    const pct = Math.round(score * 100);
    const circumference = 2 * Math.PI * 36;
    const offset = circumference - (pct / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-1">
            <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
                    <circle
                        cx="40" cy="40" r="36"
                        stroke={pct >= 85 ? "#ef4444" : pct >= 70 ? "#f59e0b" : pct >= 50 ? "#eab308" : "#10b981"}
                        strokeWidth="6" fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                    />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${scoreColor(score)}`}>
                    {pct}%
                </span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</span>
        </div>
    );
}

/* ─── stat card ─── */
function StatCard({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string | number; accent: string }) {
    return (
        <div className={`rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent p-5 flex items-center gap-4`}>
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${accent}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-400">{label}</p>
            </div>
        </div>
    );
}

/* ─── main page ─── */
export default function DeduplicacaoPage() {
    const [titulo, setTitulo] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [origem, setOrigem] = useState("");
    const [tipo, setTipo] = useState("MINUTA");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CheckResponse | null>(null);
    const [stats, setStats] = useState<StatsResponse | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    /* fetch stats */
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API}/deduplicacao/stats`);
                if (res.ok) setStats(await res.json());
            } catch { /* silent */ }
            finally { setStatsLoading(false); }
        })();
    }, []);

    /* auto-search debounced */
    const runCheck = useCallback(async (t: string, c: string, o: string, tp: string) => {
        if (t.length < 5 || c.length < 10) return;
        setLoading(true);
        try {
            const res = await fetch(`${API}/deduplicacao/verificar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ titulo: t, conteudo: c, origem: o || "NAO_INFORMADA", tipo: tp }),
            });
            if (res.ok) {
                setResult(await res.json());
            }
        } catch { /* silent */ }
        finally { setLoading(false); }
    }, []);

    const scheduleCheck = useCallback((t: string, c: string, o: string, tp: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => runCheck(t, c, o, tp), 800);
    }, [runCheck]);

    const handleTituloChange = (val: string) => { setTitulo(val); scheduleCheck(val, conteudo, origem, tipo); };
    const handleConteudoChange = (val: string) => { setConteudo(val); scheduleCheck(titulo, val, origem, tipo); };

    return (
        <div className="min-h-screen bg-[#0a0a12] text-white px-4 py-8 md:px-8 lg:px-12">
            {/* ── Header ── */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-700/30">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-300 via-purple-200 to-fuchsia-300 bg-clip-text text-transparent">
                            Deduplicação Semântica
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Motor de IA que detecta documentos duplicados entre as 41 origens — em tempo real
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    icon={FileText}
                    label="Documentos Indexados"
                    value={statsLoading ? "..." : stats?.total_documentos_indexados ?? 0}
                    accent="bg-violet-600/30 text-violet-400"
                />
                <StatCard
                    icon={Building2}
                    label="Origens Ativas"
                    value={statsLoading ? "..." : Object.keys(stats?.top_origens ?? {}).length}
                    accent="bg-purple-600/30 text-purple-400"
                />
                <StatCard
                    icon={BarChart3}
                    label="Tipos de Documento"
                    value={statsLoading ? "..." : Object.keys(stats?.por_tipo ?? {}).length}
                    accent="bg-fuchsia-600/30 text-fuchsia-400"
                />
                <StatCard
                    icon={Zap}
                    label="Modelo de Embedding"
                    value={stats?.modelo_embedding?.split(" ")[0] ?? "MiniLM-L6"}
                    accent="bg-indigo-600/30 text-indigo-400"
                />
            </div>

            {/* ── Input Section ── */}
            <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-6 mb-8">
                <div className="flex items-center gap-2 mb-5">
                    <Search className="w-4 h-4 text-violet-400" />
                    <h2 className="text-sm font-semibold text-violet-300 uppercase tracking-wider">Verificar Duplicatas</h2>
                    {loading && <Loader2 className="w-4 h-4 animate-spin text-violet-400 ml-auto" />}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs text-slate-400 mb-1.5">Título do documento</label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => handleTituloChange(e.target.value)}
                            placeholder="Ex: Projeto de Lei para pavimentação da Rua Belo Horizonte"
                            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1.5">Origem (gabinete)</label>
                            <input
                                type="text"
                                value={origem}
                                onChange={(e) => setOrigem(e.target.value)}
                                placeholder="Gabinete 01"
                                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1.5">Tipo</label>
                            <select
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition"
                            >
                                <option value="MINUTA">Minuta</option>
                                <option value="PROPOSITURA">Propositura</option>
                                <option value="REQUERIMENTO">Requerimento</option>
                                <option value="INDICACAO">Indicação</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Conteúdo / Ementa</label>
                    <textarea
                        value={conteudo}
                        onChange={(e) => handleConteudoChange(e.target.value)}
                        rows={4}
                        placeholder="Cole aqui o conteúdo ou ementa do documento. A IA irá buscar semanticamente por documentos similares já cadastrados nas 41 origens..."
                        className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition resize-none"
                    />
                </div>

                <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-500">
                    <Info className="w-3.5 h-3.5" />
                    <span>A busca é disparada automaticamente ao digitar (debounce 800ms). Mínimo: 5 chars no título + 10 no conteúdo.</span>
                </div>
            </div>

            {/* ── Results ── */}
            {result && (
                <div className="space-y-4">
                    {/* Summary Banner */}
                    <div className={`rounded-xl border p-4 flex items-center gap-4 ${result.has_duplicates
                            ? "border-red-500/40 bg-red-500/10"
                            : result.total_candidatos > 0
                                ? "border-amber-500/40 bg-amber-500/10"
                                : "border-emerald-500/40 bg-emerald-500/10"
                        }`}>
                        {result.has_duplicates ? (
                            <XCircle className="w-6 h-6 text-red-400 shrink-0" />
                        ) : result.total_candidatos > 0 ? (
                            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                        ) : (
                            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                        )}
                        <div>
                            <p className="text-sm font-semibold text-white">
                                {result.has_duplicates
                                    ? `⚠ Duplicata detectada! ${result.total_candidatos} candidato(s)`
                                    : result.total_candidatos > 0
                                        ? `${result.total_candidatos} documento(s) possivelmente relacionado(s)`
                                        : "Nenhum documento similar encontrado — pode prosseguir"
                                }
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">{result.recomendacao}</p>
                        </div>
                    </div>

                    {/* Cards */}
                    {result.resultados.map((r, i) => {
                        const badge = badgeLabel(r);
                        return (
                            <div
                                key={r.documento_id + i}
                                className={`rounded-xl border p-5 transition-all hover:scale-[1.005] ${scoreBg(r.cross_encoder_score)}`}
                            >
                                <div className="flex flex-col lg:flex-row gap-5">
                                    {/* Left: Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badge.cls}`}>
                                                {badge.text}
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-mono">{r.documento_tipo}</span>
                                        </div>
                                        <h3 className="text-sm font-semibold text-white mb-1 truncate">{r.titulo}</h3>
                                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">{r.conteudo_resumo || "Sem resumo disponível"}</p>
                                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Building2 className="w-3 h-3" /> {r.origem}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FileText className="w-3 h-3" /> {r.documento_id.slice(0, 8)}...
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right: Gauges */}
                                    <div className="flex items-center gap-6 shrink-0">
                                        <SimilarityGauge score={r.similarity_score} label="Cosine" />
                                        <SimilarityGauge score={r.cross_encoder_score} label="Cross-Enc" />
                                        <div className="flex flex-col items-center gap-1">
                                            <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 ${r.is_duplicate ? "border-red-500 bg-red-500/20" : "border-emerald-500 bg-emerald-500/20"
                                                }`}>
                                                {r.is_duplicate ? (
                                                    <XCircle className="w-8 h-8 text-red-400" />
                                                ) : (
                                                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                                                )}
                                            </div>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Decisão</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Stats Detail ── */}
            {stats && !stats.error && (
                <div className="mt-10 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                        <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Distribuição por Origem</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {Object.entries(stats.top_origens ?? {}).map(([origem, count]) => (
                            <div key={origem} className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3 text-center">
                                <p className="text-lg font-bold text-violet-300">{count as number}</p>
                                <p className="text-[10px] text-slate-400 truncate">{origem}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
