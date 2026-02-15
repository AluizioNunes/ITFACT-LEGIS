"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Database, Brain, Bot, Zap,
    Shield, Eye, EyeOff, Save, RotateCcw, Check,
    AlertTriangle, ChevronDown, Plug, Activity, Settings2,
    Sparkles, Crown, RefreshCw, Globe, Cpu,
    Layers, Radio, HardDrive, BarChart3, MonitorDot, Network,
    FileText, Upload, Trash2, FilePlus, Search, Info
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

interface ServiceConfig {
    [key: string]: string;
}

interface AIProvider {
    id: string;
    name: string;
    logo: string;
    color: string;
    bgGradient: string;
    models: string[];
    fields: { key: string; label: string; type: "text" | "password" | "url"; placeholder: string }[];
    config: ServiceConfig;
    enabled: boolean;
    category: "local" | "managed";
    capabilities: ("chat" | "embedding" | "image" | "reasoning")[];
}

interface ModuleAIOverride {
    module: string;
    label: string;
    description: string;
    icon: React.ElementType;
    provider: string; // provider id or "global"
    model: string;
}

// ═══════════════════════════════════════════════════════════════════
// DATA: Serviços Integrados
// ═══════════════════════════════════════════════════════════════════

const services = [
    {
        id: "postgresql",
        label: "PostgreSQL",
        icon: Database,
        color: "#336791",
        description: "Banco de dados relacional principal com extensão pgvector para busca vetorial de embeddings (1024 dims).",
        fields: [
            { key: "host", label: "Host", type: "text" as const, placeholder: "postgres", defaultValue: "postgres" },
            { key: "port", label: "Porta", type: "text" as const, placeholder: "5432", defaultValue: "5432" },
            { key: "database", label: "Database", type: "text" as const, placeholder: "itfact_legis", defaultValue: "LEGIS" },
            { key: "user", label: "Usuário", type: "text" as const, placeholder: "postgres", defaultValue: "LEGIS" },
            { key: "password", label: "Senha", type: "password" as const, placeholder: "••••••", defaultValue: "" },
            { key: "pgvector", label: "pgvector Habilitado", type: "text" as const, placeholder: "true", defaultValue: "true" },
            { key: "max_connections", label: "Max Connections", type: "text" as const, placeholder: "100", defaultValue: "100" },
        ],
    },
    {
        id: "active_directory",
        label: "Active Directory",
        icon: Shield,
        color: "#0078D4",
        description: "Serviço de diretório da Microsoft para autenticação centralizada e gerenciamento de permissões (LDAPS).",
        fields: [
            { key: "host", label: "Domain Controller Host", type: "text" as const, placeholder: "ad.empresa.com", defaultValue: "" },
            { key: "port", label: "LDAPS Port", type: "text" as const, placeholder: "636", defaultValue: "636" },
            { key: "domain", label: "Domínio", type: "text" as const, placeholder: "EMPRESA", defaultValue: "" },
            { key: "base_dn", label: "Base DN", type: "text" as const, placeholder: "DC=empresa,DC=com", defaultValue: "" },
            { key: "service_user", label: "Usuário de Serviço (DN)", type: "text" as const, placeholder: "CN=ServiceAccount,OU=Users,DC=empresa,DC=com", defaultValue: "" },
            { key: "service_password", label: "Senha do Usuário de Serviço", type: "password" as const, placeholder: "••••••", defaultValue: "" },
            { key: "admin_user", label: "Usuário Administrador (AD)", type: "text" as const, placeholder: "ADMINISTRADOR", defaultValue: "" },
            { key: "admin_password", label: "Senha do Administrador", type: "password" as const, placeholder: "••••••", defaultValue: "" },
            { key: "use_ssl", label: "Usar SSL/TLS", type: "text" as const, placeholder: "true", defaultValue: "true" },
        ],
    },
    {
        id: "ldap",
        label: "LDAP",
        icon: Network,
        color: "#2C3E50",
        description: "Protocolo leve de acesso a diretórios para integração com sistemas legados e OpenLDAP.",
        fields: [
            { key: "uri", label: "LDAP URI", type: "url" as const, placeholder: "ldap://host:389", defaultValue: "" },
            { key: "bind_dn", label: "Bind DN", type: "text" as const, placeholder: "cn=admin,dc=example,dc=com", defaultValue: "" },
            { key: "bind_password", label: "Bind Password", type: "password" as const, placeholder: "••••••", defaultValue: "" },
            { key: "search_base", label: "Search Base", type: "text" as const, placeholder: "dc=example,dc=com", defaultValue: "" },
            { key: "search_filter", label: "Search Filter", type: "text" as const, placeholder: "(uid=%s)", defaultValue: "" },
            { key: "group_base", label: "Group Base DN", type: "text" as const, placeholder: "ou=Groups,dc=example,dc=com", defaultValue: "" },
        ],
    },
    {
        id: "redis",
        label: "Redis",
        icon: Zap,
        color: "#DC382D",
        description: "Cache em memória, sessões, pub/sub e rate limiting. Usado pelo NestJS e FastAPI.",
        fields: [
            { key: "host", label: "Host", type: "text" as const, placeholder: "redis", defaultValue: "redis" },
            { key: "port", label: "Porta", type: "text" as const, placeholder: "6379", defaultValue: "6379" },
            { key: "password", label: "Senha", type: "password" as const, placeholder: "••••••", defaultValue: "" },
            { key: "max_memory", label: "Max Memory", type: "text" as const, placeholder: "256mb", defaultValue: "256mb" },
            { key: "db_index", label: "DB Index", type: "text" as const, placeholder: "0", defaultValue: "0" },
        ],
    },
    {
        id: "mongodb",
        label: "MongoDB",
        icon: Layers,
        color: "#47A248",
        description: "Documentos não-estruturados, logs de IA e metadados flexíveis. Driver async (motor).",
        fields: [
            { key: "uri", label: "URI", type: "url" as const, placeholder: "mongodb://user:pass@host:27017", defaultValue: "" },
            { key: "auth_source", label: "Auth Source", type: "text" as const, placeholder: "admin", defaultValue: "admin" },
            { key: "database", label: "Database", type: "text" as const, placeholder: "itfact_legis", defaultValue: "itfact_legis" },
            { key: "user", label: "Usuário", type: "text" as const, placeholder: "LEGIS", defaultValue: "LEGIS" },
            { key: "password", label: "Senha", type: "password" as const, placeholder: "••••••", defaultValue: "" },
        ],
    },
    {
        id: "neo4j",
        label: "Neo4j",
        icon: Network,
        color: "#018BFF",
        description: "Banco de dados em grafo de alto desempenho para o Knowledge Graph legislativo.",
        fields: [
            { key: "uri", label: "URI (Bolt)", type: "url" as const, placeholder: "bolt://neo4j:7687", defaultValue: "bolt://neo4j:7687" },
            { key: "user", label: "Usuário", type: "text" as const, placeholder: "neo4j", defaultValue: "neo4j" },
            { key: "password", label: "Senha", type: "password" as const, placeholder: "••••••", defaultValue: "" },
            { key: "http_port", label: "Porta HTTP", type: "text" as const, placeholder: "7474", defaultValue: "7474" },
        ],
    },
    {
        id: "graphiti",
        label: "Graphiti",
        icon: Brain,
        color: "#9333EA",
        description: "Temporal Knowledge Graph Engine. Responsável pela extração e evolução do grafo legislativo.",
        fields: [
            { key: "version", label: "Versão do Engine", type: "text" as const, placeholder: "v0.27.1", defaultValue: "v0.27.1" },
            { key: "telemetry", label: "Telemetria", type: "text" as const, placeholder: "false", defaultValue: "false" },
        ],
    },
    {
        id: "rabbitmq",
        label: "RabbitMQ",
        icon: Radio,
        color: "#FF6600",
        description: "Message broker para filas assíncronas (semantic.index, graphiti.index). Management UI na porta 15672.",
        fields: [
            { key: "host", label: "Host", type: "text" as const, placeholder: "rabbitmq", defaultValue: "rabbitmq" },
            { key: "port", label: "Porta AMQP", type: "text" as const, placeholder: "5672", defaultValue: "5672" },
            { key: "management_port", label: "Porta Management", type: "text" as const, placeholder: "15672", defaultValue: "15672" },
            { key: "user", label: "Usuário", type: "text" as const, placeholder: "LEGIS", defaultValue: "LEGIS" },
            { key: "password", label: "Senha", type: "password" as const, placeholder: "••••••", defaultValue: "" },
            { key: "vhost", label: "Virtual Host", type: "text" as const, placeholder: "/", defaultValue: "/" },
        ],
    },
    {
        id: "minio",
        label: "MinIO (S3)",
        icon: HardDrive,
        color: "#C72C41",
        description: "Object storage S3-compatível para PDFs, documentos e anexos legislativos.",
        fields: [
            { key: "endpoint", label: "Endpoint", type: "url" as const, placeholder: "minio:9000", defaultValue: "minio:9000" },
            { key: "access_key", label: "Access Key", type: "text" as const, placeholder: "minioadmin", defaultValue: "minioadmin" },
            { key: "secret_key", label: "Secret Key", type: "password" as const, placeholder: "••••••", defaultValue: "" },
            { key: "bucket", label: "Bucket Principal", type: "text" as const, placeholder: "itfact-legis", defaultValue: "itfact-legis" },
            { key: "region", label: "Region", type: "text" as const, placeholder: "us-east-1", defaultValue: "us-east-1" },
            { key: "console_port", label: "Console Port", type: "text" as const, placeholder: "9001", defaultValue: "9001" },
        ],
    },
    {
        id: "prometheus",
        label: "Prometheus",
        icon: BarChart3,
        color: "#E6522C",
        description: "Coleta de métricas de todos os serviços. Scrape FastAPI e NestJS a cada 15s.",
        fields: [
            { key: "url", label: "URL", type: "url" as const, placeholder: "http://prometheus:9090", defaultValue: "http://prometheus:9090" },
            { key: "scrape_interval", label: "Scrape Interval", type: "text" as const, placeholder: "15s", defaultValue: "15s" },
            { key: "retention", label: "Retention", type: "text" as const, placeholder: "30d", defaultValue: "30d" },
        ],
    },
    {
        id: "grafana",
        label: "Grafana",
        icon: MonitorDot,
        color: "#F46800",
        description: "Dashboards de monitoramento. Datasource Prometheus pré-configurado. Porta 3200.",
        fields: [
            { key: "url", label: "URL", type: "url" as const, placeholder: "http://grafana:3000", defaultValue: "http://grafana:3000" },
            { key: "external_port", label: "Porta Externa", type: "text" as const, placeholder: "3200", defaultValue: "3200" },
            { key: "admin_user", label: "Admin User", type: "text" as const, placeholder: "admin", defaultValue: "admin" },
            { key: "admin_password", label: "Admin Password", type: "password" as const, placeholder: "••••••", defaultValue: "" },
        ],
    },
    {
        id: "nginx",
        label: "Nginx",
        icon: Globe,
        color: "#009639",
        description: "Reverse proxy + SSL termination. Roteia tráfego para Frontend, NestJS e FastAPI.",
        fields: [
            { key: "http_port", label: "HTTP Port", type: "text" as const, placeholder: "80", defaultValue: "80" },
            { key: "https_port", label: "HTTPS Port", type: "text" as const, placeholder: "443", defaultValue: "443" },
            { key: "ssl_cert", label: "SSL Certificate Path", type: "text" as const, placeholder: "/etc/nginx/ssl/cert.pem", defaultValue: "" },
            { key: "ssl_key", label: "SSL Key Path", type: "text" as const, placeholder: "/etc/nginx/ssl/key.pem", defaultValue: "" },
            { key: "upstream_nestjs", label: "Upstream NestJS", type: "url" as const, placeholder: "http://nestjs:3001", defaultValue: "http://nestjs:3001" },
            { key: "upstream_fastapi", label: "Upstream FastAPI", type: "url" as const, placeholder: "http://fastapi:8000", defaultValue: "http://fastapi:8000" },
        ],
    },
];

// ═══════════════════════════════════════════════════════════════════
// DATA: Provedores de IA
// ═══════════════════════════════════════════════════════════════════

const defaultAIProviders: AIProvider[] = [
    {
        id: "ollama",
        name: "Ollama (IA Local)",
        logo: "🦙",
        color: "#1D1D1F",
        bgGradient: "from-neutral-500/10 to-neutral-600/5",
        models: ["llama3.1", "llama3.3", "qwen2.5", "gemma2", "gemma3", "bge-m3", "mistral-nemo", "stable-diffusion-v1.5"],
        fields: [
            { key: "base_url", label: "Base URL (Interno)", type: "url" as const, placeholder: "http://ollama:11434" },
            { key: "embedding_model", label: "Embedding Model", type: "text" as const, placeholder: "bge-m3" },
        ],
        config: { base_url: "http://ollama:11434", embedding_model: "bge-m3", model: "llama3.1", image_model: "stable-diffusion-v1.5" },
        enabled: true,
        category: "local",
        capabilities: ["chat", "embedding", "image", "reasoning"],
    },
];

const defaultModuleOverrides: ModuleAIOverride[] = [
    { module: "legislativo_ia", label: "Legislativo IA", description: "Geração de textos, resumos e análise jurídica", icon: Cpu, provider: "global", model: "llama3.1" },
    { module: "atas_ia", label: "Atas IA", description: "Geração automática de atas de sessão plenária", icon: Bot, provider: "global", model: "llama3.1" },
    { module: "deduplicacao", label: "Deduplicação", description: "Detecção de minutas duplicadas (e5-large + mmarco)", icon: Layers, provider: "global", model: "llama3.1" },
    { module: "pesquisa", label: "Pesquisa Inteligente", description: "Busca semântica com embeddings em todo o acervo", icon: Sparkles, provider: "global", model: "llama3.1" },
    { module: "graphiti", label: "Graphiti KG", description: "Knowledge Graph — extração de entidades legislativas", icon: Network, provider: "global", model: "llama3.1" },
    { module: "workflow", label: "Workflow IA", description: "Automação de tramitação com regras inteligentes", icon: Zap, provider: "global", model: "llama3.1" },
];

// ═══════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function PasswordField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <input
                type={show ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 pr-10 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all"
            />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
    );
}

function ServiceTab({ service, stats }: { service: typeof services[0]; stats?: any }) {
    const [config, setConfig] = useState<ServiceConfig>(() => {
        const initial: ServiceConfig = {};
        service.fields.forEach(f => { initial[f.key] = f.defaultValue || ""; });
        return initial;
    });
    const [saved, setSaved] = useState(false);
    const [testing, setTesting] = useState(false);
    const [status, setStatus] = useState<"online" | "offline" | "unknown">("unknown");
    const [lastError, setLastError] = useState<string | null>(null);

    // Buscar configuração real do Backend ao montar
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost/api/python";
                const res = await fetch(`${apiUrl}/system/integracoes/config`);
                if (res.ok) {
                    const data = await res.json();
                    if (data[service.id]) {
                        // Mesclar valores reais sobre os padrões
                        setConfig(prev => ({ ...prev, ...data[service.id] }));
                    }
                }
            } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
                console.error(`Falha ao carregar config de ${service.id}`);
            }
        };

        const checkStatus = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost/api/python";
                const res = await fetch(`${apiUrl}/system/integracoes/status`);
                if (res.ok) {
                    const data = await res.json();
                    const s = data.find((item: any) => item.id === service.id);
                    if (s) {
                        setStatus(s.status);
                        setLastError(s.error || null);
                    }
                }
            } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
                setStatus("unknown");
            }
        };

        fetchConfig();
        checkStatus();
    }, [service.id]);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleTestConnection = async () => {
        setTesting(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost/api/python";
            const res = await fetch(`${apiUrl}/system/integracoes/test/${service.id}`, { method: "POST" });
            const data = await res.json();
            if (data.success) {
                setStatus("online");
                setLastError(null);
            } else {
                setStatus("offline");
                setLastError(data.error || "Serviço não responde.");
            }
        } catch {
            setStatus("offline");
            setLastError("Erro de rede.");
        } finally {
            setTesting(false);
        }
    };

    const Icon = service.icon;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-[var(--color-border)]">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${service.color}15` }}>
                    <Icon size={24} style={{ color: service.color }} />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">{service.label}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{service.description}</p>
                </div>
                <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${status === "online" ? "bg-green-500/10 text-green-500" :
                        status === "offline" ? "bg-red-500/10 text-red-500" :
                            "bg-[var(--color-surface-2)] text-[var(--color-text-muted)]"
                        }`}
                >
                    <Activity size={12} className={status === "online" ? "animate-pulse" : ""} />
                    {status === "online" ? "Serviço Online" : status === "offline" ? "Serviço Offline" : "Status Desconhecido"}
                </div>
            </div>

            {/* Fields & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {service.fields.map((field) => (
                            <div key={field.key} className="space-y-1.5">
                                <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">{field.label}</label>
                                {field.type === "password" ? (
                                    <PasswordField value={config[field.key] || ""} onChange={(v) => setConfig({ ...config, [field.key]: v })} placeholder={field.placeholder} />
                                ) : (
                                    <input
                                        type="text"
                                        value={config[field.key] || ""}
                                        onChange={(e) => setConfig({ ...config, [field.key]: e.target.value })}
                                        placeholder={field.placeholder}
                                        className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Metrics Card */}
                <div className="bg-[var(--color-surface-2)]/30 rounded-xl border border-[var(--color-border)] p-4 space-y-4 h-fit">
                    <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2 mb-2">
                        <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Métricas Reais</span>
                        <div className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${stats?.status === 'online' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {stats?.status || 'Polling...'}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {service.id === 'postgresql' && (
                            <>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] text-[var(--color-text-muted)] uppercase">Databases</p>
                                    <p className="text-lg font-bold">{stats?.databases || '0'}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] text-[var(--color-text-muted)] uppercase">Tabelas</p>
                                    <p className="text-lg font-bold">{stats?.tables || '0'}</p>
                                </div>
                            </>
                        )}
                        {service.id === 'neo4j' && (
                            <>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] text-[var(--color-text-muted)] uppercase">Nós (Total)</p>
                                    <p className="text-lg font-bold text-[#018BFF]">{stats?.nodes || '0'}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] text-[var(--color-text-muted)] uppercase">Conexões</p>
                                    <p className="text-lg font-bold">{stats?.relationships || '0'}</p>
                                </div>
                            </>
                        )}
                        {service.id === 'graphiti' && (
                            <>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] text-[var(--color-text-muted)] uppercase">Episódios</p>
                                    <p className="text-lg font-bold text-violet-500">{stats?.episodes || '0'}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] text-[var(--color-text-muted)] uppercase">Entidades</p>
                                    <p className="text-lg font-bold text-emerald-500">{stats?.entities || '0'}</p>
                                </div>
                            </>
                        )}
                        {service.id === 'redis' && (
                            <>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] text-[var(--color-text-muted)] uppercase">Keys</p>
                                    <p className="text-lg font-bold">{stats?.keys || '0'}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] text-[var(--color-text-muted)] uppercase">Memória</p>
                                    <p className="text-lg font-bold">{stats?.memory_used || '...'}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border)]">
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 transition-all">
                    {saved ? <Check size={16} /> : <Save size={16} />}
                    {saved ? "Salvo!" : "Salvar Configurações"}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-all">
                    <RotateCcw size={16} />
                    Restaurar Padrão
                </button>
                <button
                    onClick={handleTestConnection}
                    disabled={testing}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm transition-all ${testing ? "opacity-50 cursor-not-allowed" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]"
                        }`}
                >
                    {testing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    {testing ? "Testando..." : "Testar Conexão"}
                </button>
                {lastError && (
                    <div className="flex items-center gap-2 text-xs text-red-500 font-medium">
                        <AlertTriangle size={14} />
                        {lastError}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function AIProviderCard({ provider, onUpdate, role }: { provider: AIProvider; onUpdate: (p: AIProvider) => void; role?: "chat" | "embedding" | "image" }) {
    const [expanded, setExpanded] = useState(false);
    const [show, setShow] = useState<Record<string, boolean>>({});

    const activeModel = role === "embedding"
        ? provider.config.embedding_model
        : (role === "image" ? provider.config.image_model : provider.config.model);

    return (
        <motion.div layout className={`rounded-xl border transition-all duration-300 ${provider.enabled ? "border-violet-500/30 bg-gradient-to-br " + provider.bgGradient : "border-[var(--color-border)] bg-[var(--color-surface)] opacity-70"}`}>
            {/* Card Header */}
            <div className="flex items-center gap-3 p-4 cursor-pointer select-none" onClick={() => setExpanded(!expanded)}>
                <span className="text-2xl">{provider.logo}</span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-[var(--color-text)] truncate">{provider.name}</h4>
                        {provider.enabled && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                    </div>
                    <p className="text-[10px] text-[var(--color-text-muted)] font-medium uppercase tracking-tight">{activeModel || "Nenhum modelo selecionado"}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={provider.enabled} onChange={() => onUpdate({ ...provider, enabled: !provider.enabled })} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--color-surface-2)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-primary)]" />
                </label>
                <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={18} className="text-[var(--color-text-muted)]" />
                </motion.div>
            </div>

            {/* Expanded Config */}
            <AnimatePresence>
                {expanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="px-4 pb-4 space-y-3 border-t border-[var(--color-border)]/50 pt-3">
                            {/* Models */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Modelos Disponíveis</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {provider.models.map((model) => (
                                        <button
                                            key={model}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newConfig = { ...provider.config };
                                                if (role === "embedding") newConfig.embedding_model = model;
                                                else if (role === "image") newConfig.image_model = model;
                                                else newConfig.model = model;
                                                onUpdate({ ...provider, config: newConfig });
                                            }}
                                            className={`px-2 py-1 text-[10px] rounded-md border transition-all shadow-sm ${activeModel === model
                                                ? "bg-violet-600 text-white border-violet-700 font-bold scale-105"
                                                : "bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border-[var(--color-border)]/50 hover:border-violet-500/50 hover:text-violet-500"
                                                }`}
                                        >
                                            {model}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Fields */}
                            {provider.fields.map((field) => (
                                <div key={field.key} className="space-y-1.5">
                                    <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">{field.label}</label>
                                    {field.type === "password" ? (
                                        <div className="relative">
                                            <input
                                                type={show[field.key] ? "text" : "password"}
                                                value={provider.config[field.key] || ""}
                                                onChange={(e) => onUpdate({ ...provider, config: { ...provider.config, [field.key]: e.target.value } })}
                                                placeholder={field.placeholder}
                                                className="w-full px-3 py-2 pr-10 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all"
                                            />
                                            <button type="button" onClick={() => setShow({ ...show, [field.key]: !show[field.key] })} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                                                {show[field.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={provider.config[field.key] || ""}
                                            onChange={(e) => onUpdate({ ...provider, config: { ...provider.config, [field.key]: e.target.value } })}
                                            placeholder={field.placeholder}
                                            className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function AddProviderModal({ onClose, onSave }: { onClose: () => void, onSave: (p: AIProvider) => void }) {
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [baseUrl, setBaseUrl] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [model, setModel] = useState("");
    const [packages, setPackages] = useState("");
    const [checking, setChecking] = useState(false);
    const [installing, setInstalling] = useState(false);
    const [status, setStatus] = useState<string>("");

    const handleSave = async () => {
        if (!name || !id) return;

        // 1. Check Packages
        const pkgList = packages.split(",").map(p => p.trim()).filter(p => p);
        if (pkgList.length > 0) {
            setChecking(true);
            setStatus("Verificando pacotes...");
            try {
                const checkRes = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000"}/system/packages/check`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ packages: pkgList })
                });
                const checkData = await checkRes.json();

                if (checkData.missing && checkData.missing.length > 0) {
                    setStatus(`Instalando: ${checkData.missing.join(", ")}...`);
                    setInstalling(true);

                    await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000"}/system/packages/install`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ packages: checkData.missing })
                    });
                    // Wait a bit for server restart (simple heuristic)
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            } catch (error) {
                console.error("Package check failed:", error);
                setStatus("Erro ao verificar pacotes.");
                setChecking(false);
                setInstalling(false);
                return;
            }
            setChecking(false);
            setInstalling(false);
        }

        // 2. Construct Provider Object
        const newProvider: AIProvider = {
            id: id.toLowerCase().replace(/\s+/g, "_"),
            name: name,
            logo: "🤖",
            color: "#6366f1",
            bgGradient: "from-indigo-500/10 to-purple-600/5",
            models: model ? [model] : ["default"],
            fields: [
                { key: "base_url", label: "Base URL", type: "url", placeholder: "https://api.example.com/v1" },
                { key: "api_key", label: "API Key", type: "password", placeholder: "sk-..." }
            ],
            config: {
                base_url: baseUrl,
                api_key: apiKey,
                model: model,
                packages: packages // Store raw string for reference
            },
            enabled: true,
            category: "managed",
            capabilities: ["chat"]
        };

        onSave(newProvider);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl p-6 w-full max-w-md space-y-4">
                <h3 className="text-lg font-bold">Adicionar Provedor IA</h3>

                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-bold uppercase text-[var(--color-text-muted)]">Nome</label>
                        <input className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]" value={name} onChange={e => { setName(e.target.value); setId(e.target.value.toLowerCase().replace(/\s+/g, "_")); }} placeholder="Ex: Groq" />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-[var(--color-text-muted)]">ID (Slug)</label>
                        <input className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]" value={id} onChange={e => setId(e.target.value)} placeholder="groq" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs font-bold uppercase text-[var(--color-text-muted)]">URL Base</label>
                            <input className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]" value={baseUrl} onChange={e => setBaseUrl(e.target.value)} placeholder="https://..." />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-[var(--color-text-muted)]">Modelo Padrão</label>
                            <input className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]" value={model} onChange={e => setModel(e.target.value)} placeholder="llama3-70b" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-[var(--color-text-muted)]">API Key</label>
                        <input type="password" className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-..." />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-[var(--color-text-muted)]">Pacotes Python (Pip)</label>
                        <input className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]" value={packages} onChange={e => setPackages(e.target.value)} placeholder="Ex: groq, requests" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Separados por vírgula. Serão instalados automaticamente.</p>
                    </div>
                </div>

                {/* Status Feedback */}
                {(checking || installing) && (
                    <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500 text-xs font-medium flex items-center gap-2">
                        <RefreshCw size={14} className="animate-spin" />
                        {status}
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm hover:bg-[var(--color-surface-2)]">Cancelar</button>
                    <button onClick={handleSave} disabled={checking || installing} className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-bold shadow-lg hover:opacity-90 disabled:opacity-50">
                        {installing ? "Instalando..." : "Salvar & Instalar"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function KnowledgeBaseTab() {
    const [files, setFiles] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [indexingProgress, setIndexingProgress] = useState(0);
    const [indexingLogs, setIndexingLogs] = useState<{ id: string, message: string, type: 'log' | 'error' | 'success' }[]>([]);
    const terminalEndRef = React.useRef<HTMLDivElement>(null);
    const API_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000";

    const scrollToBottom = () => {
        terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [indexingLogs]);

    const fetchFiles = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/ai/knowledge-base/files`);
            if (res.ok) {
                const data = await res.json();
                setFiles(data);
            }
        } catch (error) {
            console.error("Erro ao buscar arquivos:", error);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    const fetchStats = React.useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/ai/knowledge-base/stats`);
            if (res.ok) setStats(await res.json());
        } catch (error) { console.error("Erro ao buscar stats:", error); }
    }, [API_URL]);

    useEffect(() => {
        fetchFiles();
        fetchStats();
    }, [fetchFiles, fetchStats]);

    const filteredFiles = files.filter(f =>
        f.base_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log("KB Upload triggered for:", file.name);
        setUploading(true);
        setIndexingProgress(0);
        setIndexingLogs([{ id: 'start', message: `Iniciando upload de ${file.name}...`, type: 'log' }]);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${API_URL}/ai/knowledge-base/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.body) throw new Error("Stream not supported");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const data = JSON.parse(line);
                        if (data.type === 'progress') {
                            setIndexingProgress(data.value);
                        } else if (data.type === 'log') {
                            setIndexingLogs(prev => [...prev, { id: Math.random().toString(), message: data.message, type: 'log' }]);
                        } else if (data.type === 'error') {
                            setIndexingLogs(prev => [...prev, { id: Math.random().toString(), message: `ERRO: ${data.message}`, type: 'error' }]);
                        } else if (data.type === 'done') {
                            setIndexingLogs(prev => [...prev, { id: 'done', message: "Processamento concluído com sucesso!", type: 'success' }]);
                            fetchFiles();
                            // Keep uploading true for a moment to show "Concluído"
                            setTimeout(() => setUploading(false), 3000);
                        }
                    } catch (e) {
                        console.error("Error parsing NDJSON line:", e);
                    }
                }
            }
        } catch (error) {
            console.error("Erro no upload:", error);
            setIndexingLogs(prev => [...prev, { id: 'err', message: "Erro fatal na conexão com o servidor.", type: 'error' }]);
            setTimeout(() => setUploading(false), 5000);
        }
    };

    const handleDelete = async (baseName: string) => {
        if (!confirm(`Deseja remover todas as versões de "${baseName}" da base de conhecimento?`)) return;

        try {
            const res = await fetch(`${API_URL}/ai/knowledge-base/files/${baseName}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchFiles();
            }
        } catch (error) {
            console.error("Erro ao deletar documento:", error);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-8 pb-10">
            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                    <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Documentos</p>
                    <p className="text-2xl font-black text-indigo-500">{stats?.total_documents || files.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                    <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Armazenamento</p>
                    <p className="text-2xl font-black">{formatSize(stats?.total_size_bytes || 0)}</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                    <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Episódios IA</p>
                    <p className="text-2xl font-black text-emerald-500">{stats?.indexed_episodes || 0}</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                    <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Status Storage</p>
                    <div className="flex items-center gap-2 text-green-500 font-bold">
                        <Check size={16} />
                        <span>Ativo</span>
                    </div>
                </div>
            </div>

            {/* Actions & Search */}
            <div className="flex flex-col md:flex-row items-center gap-4 pb-4 border-b border-[var(--color-border)]">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                    <Brain size={24} className="text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">Base de Conhecimento (RAG)</h3>
                    <p className="text-sm text-[var(--color-text-muted)] truncate">Gerencie documentos PDF que a IA utilizará como contexto para responder perguntas.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                        <input
                            type="text"
                            placeholder="Buscar documentos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>

                    <div className="relative inline-block shrink-0">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50 disabled:cursor-not-allowed"
                            title="Upload PDF"
                            disabled={uploading}
                        />
                        <button className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg ${uploading
                            ? 'bg-amber-500 text-white animate-pulse shadow-amber-200/50'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-indigo-200/50'
                            }`}>
                            {uploading ? <RefreshCw size={18} className="animate-spin" /> : <Upload size={18} />}
                            {uploading ? "INDEXANDO..." : "UPLOAD PDF"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Indexing Feedback Area */}
            {uploading && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                >
                    {/* Progress Bar Container */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 uppercase tracking-widest">
                                <Activity size={14} className="animate-pulse" />
                                Progresso da IA
                            </span>
                            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 leading-none">
                                {indexingProgress}%
                            </span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 p-0.5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${indexingProgress}%` }}
                                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                            />
                        </div>
                    </div>

                    {/* Terminal Shell UI */}
                    <div className="rounded-xl overflow-hidden border border-slate-900 bg-[#0c0c0d] shadow-2xl relative">
                        <div className="bg-[#1a1b1e] px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">ai-shell-v1.0</span>
                        </div>
                        <div className="p-4 h-48 overflow-y-auto font-mono text-xs space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                            {indexingLogs.map((log) => (
                                <div key={log.id} className="flex gap-2">
                                    <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                                    <span className={
                                        log.type === 'error' ? 'text-red-400 font-bold' :
                                            log.type === 'success' ? 'text-green-400 font-bold' :
                                                'text-emerald-400'
                                    }>
                                        {log.type === 'error' ? '✖' : log.type === 'success' ? '✔' : '>'} {log.message}
                                    </span>
                                </div>
                            ))}
                            <div ref={terminalEndRef} />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Info Box */}
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Info size={18} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    Arquivos enviados aqui são processados por redes neurais, convertidos em vetores e armazenados como nós no <span className="text-indigo-600 dark:text-indigo-400 font-bold">Grafo de Conhecimento (Neo4j)</span>.
                    <br />
                    <span className="text-[11px] opacity-75">Local: Backend/BaseConhecimento</span>
                </p>
            </div>

            {/* Files List */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] flex items-center gap-2">
                    <FileText size={14} />
                    Documentos Indexados ({files.length})
                </h4>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 rounded-xl bg-[var(--color-surface-2)] animate-pulse border border-[var(--color-border)]" />
                        ))}
                    </div>
                ) : filteredFiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)]/30">
                        <FilePlus size={48} className="text-[var(--color-text-muted)] mb-4 opacity-20" />
                        <p className="text-sm text-[var(--color-text-muted)] text-center font-medium">Nenhum documento encontrado para &quot;{searchTerm}&quot;.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredFiles.map((file) => (
                            <motion.div
                                key={file.base_name}
                                whileHover={{ y: -2 }}
                                className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-indigo-500/30 transition-all group overflow-hidden relative"
                            >
                                <div className="absolute top-3 right-3 flex items-center gap-1">
                                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase tracking-wider">
                                        v{file.version}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(file.base_name)}
                                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                                        <FileText size={20} className="text-red-500" />
                                    </div>
                                </div>
                                <h5 className="text-sm font-semibold text-[var(--color-text)] truncate mb-1" title={file.base_name}>
                                    {file.base_name}
                                </h5>
                                <p className="text-[10px] text-[var(--color-text-muted)] truncate mb-2 opacity-60">
                                    {file.name}
                                </p>
                                <div className="flex items-center gap-3 text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-tighter">
                                    <span>{formatSize(file.size)}</span>
                                    <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                                    <span>{new Date(file.created_at).toLocaleDateString()}</span>
                                </div>

                                {file.episode_id && (
                                    <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 overflow-hidden">
                                            <Activity size={10} className="text-emerald-500 shrink-0" />
                                            <span className="text-[9px] text-[var(--color-text-muted)] truncate">ID: {file.episode_id}</span>
                                        </div>
                                        <div className="flex items-center gap-1 cursor-help group/tip relative">
                                            <Zap size={10} className="text-amber-500" />
                                            <span className="text-[9px] font-bold text-amber-600 bg-amber-500/10 px-1 rounded">RAG READY</span>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function AITab() {
    const [providers, setProviders] = useState<AIProvider[]>(defaultAIProviders);
    const [modules, setModules] = useState<ModuleAIOverride[]>(defaultModuleOverrides);
    const [globalProvider, setGlobalProvider] = useState("ollama");
    const [globalModel, setGlobalModel] = useState("llama3.1");
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const handleAddProvider = async (provider: AIProvider) => {
        // Save to Backend
        try {
            const payload = {
                id: provider.id,
                name: provider.name,
                base_url: provider.config.base_url,
                api_key: provider.config.api_key,
                model: provider.config.model,
                packages: provider.config.packages ? provider.config.packages.split(",").map((s: string) => s.trim()) : []
            };

            const apiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000";
            await fetch(`${apiUrl}/system/config/ai/provider`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            setProviders(prev => [...prev, provider]);
        } catch (e) {
            console.error("Failed to save custom provider", e);
            alert("Erro ao salvar provedor no backend.");
        }
    };

    const enabledProviders = providers.filter(p => p.enabled);
    const selectedGlobal = providers.find(p => p.id === globalProvider);

    // Load initial config from Backend
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000";
                const res = await fetch(`${apiUrl}/system/config/ai`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.provider) setGlobalProvider(data.provider);
                    if (data.model) setGlobalModel(data.model);

                    // Update provider configs with loaded models
                    setProviders(prev => prev.map(p => {
                        if (p.id === data.provider) {
                            return {
                                ...p,
                                config: {
                                    ...p.config,
                                    model: data.model || p.config.model,
                                    embedding_model: data.embedding_model || p.config.embedding_model,
                                    image_model: data.image_model || p.config.image_model
                                }
                            };
                        }
                        return p;
                    }));

                    // Load Custom Providers
                    if (data.custom_providers) {
                        const custom: AIProvider[] = Object.values(data.custom_providers).map((p: any) => ({
                            id: p.id,
                            name: p.name,
                            logo: "🤖",
                            color: "#6366f1",
                            bgGradient: "from-indigo-500/10 to-purple-600/5",
                            models: p.model ? [p.model] : ["default"],
                            fields: [
                                { key: "base_url", label: "Base URL", type: "url", placeholder: "https://..." },
                                { key: "api_key", label: "API Key", type: "password", placeholder: "..." }
                            ],
                            config: {
                                base_url: p.base_url,
                                api_key: p.api_key,
                                model: p.model,
                                packages: p.packages ? p.packages.join(",") : ""
                            },
                            enabled: true,
                            category: "managed",
                            capabilities: ["chat"]
                        }));

                        // Merge unique custom providers
                        setProviders(prev => {
                            const existingIds = new Set(prev.map(x => x.id));
                            const newCustom = custom.filter(c => !existingIds.has(c.id));
                            return [...prev, ...newCustom];
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to load AI config", error);
            }
        };
        fetchConfig();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const keys: Record<string, string> = {};
            providers.forEach(p => {
                if (p.config.api_key) keys[p.id] = p.config.api_key;
            });

            // Find selected provider's specific models
            const activeProvConfig = providers.find(p => p.id === globalProvider)?.config || {};

            const payload = {
                provider: globalProvider,
                model: globalModel,
                embedding_model: activeProvConfig.embedding_model,
                image_model: activeProvConfig.image_model,
                keys: keys
            };

            const apiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost/api/python";
            const res = await fetch(`${apiUrl}/system/config/ai`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            } else {
                alert("Erro ao salvar configuração!");
            }
        } catch (error) {
            console.error("Error saving config", error);
            alert("Erro de conexão com o backend.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProvider = (updated: AIProvider) => {
        setProviders(providers.map(p => p.id === updated.id ? updated : p));
    };

    const handleApplyToAll = () => {
        setModules(modules.map(m => ({ ...m, provider: "global", model: "" })));
    };

    const renderProviderSection = (title: string, icon: React.ElementType, capability: "chat" | "embedding" | "image", color: string) => {
        const filtered = providers.filter(p => p.capabilities.includes(capability));
        const Icon = icon;
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] px-1" style={{ color: color }}>
                    <Icon size={14} />
                    {title}
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {filtered.map((provider) => (
                        <AIProviderCard key={`${capability}-${provider.id}`} provider={provider} onUpdate={handleUpdateProvider} role={capability} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-10 pb-20">
            {showAddModal && <AddProviderModal onClose={() => setShowAddModal(false)} onSave={handleAddProvider} />}

            {/* ── Section 1: IA Padrão Global ── */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border)]">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center">
                        <Crown size={20} className="text-violet-500" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[var(--color-text)]">IA Padrão Global (Chat Primário)</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">O modelo selecionado abaixo será o cérebro principal do sistema</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs font-bold uppercase tracking-wider hover:bg-[var(--color-surface-3)] transition-all shadow-sm"
                    >
                        <FilePlus size={16} />
                        Adicionar Provedor
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-xl bg-gradient-to-br from-violet-500/5 to-purple-600/5 border border-violet-500/20 shadow-inner">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Provedor de Chat</label>
                        <select
                            value={globalProvider}
                            onChange={(e) => {
                                setGlobalProvider(e.target.value);
                                const p = providers.find(pr => pr.id === e.target.value);
                                if (p) setGlobalModel(p.models.includes("llama-4-maverick") ? "llama-4-maverick" : p.models[0]);
                            }}
                            className="w-full px-3 py-2.5 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all font-medium"
                        >
                            {enabledProviders.filter(p => p.capabilities.includes("chat")).map(p => (
                                <option key={p.id} value={p.id}>{p.logo} {p.name} {p.category === "local" ? "(Local)" : "(Cloud)"}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Modelo de Chat</label>
                        <select
                            value={globalModel}
                            onChange={(e) => setGlobalModel(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all font-medium"
                        >
                            {selectedGlobal?.models.map(m => (
                                <option key={m} value={m}>{m} {m === "llama-4-maverick" ? "⭐ Recomendado" : ""}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button onClick={handleApplyToAll} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-400 hover:text-violet-300 border border-violet-500/20 rounded-lg hover:bg-violet-500/10 transition-all">
                    <Sparkles size={16} />
                    Sincronizar com todos os módulos de chat
                </button>
            </div>

            {/* ── Section 2: Hub de IA (Categorizado por Função) ── */}
            <div className="space-y-8 pt-4">
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center">
                            <Brain size={20} className="text-green-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-[var(--color-text)]">Hub de Provedores por Capacidade</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Escolha modelos específicos clicando nos badges abaixo</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {renderProviderSection("🗨️ Chat & Raciocínio", Bot, "chat", "var(--color-primary)")}
                    {renderProviderSection("🧠 Embedding (Busca)", Zap, "embedding", "#8B5CF6")}
                    {renderProviderSection("🎨 Imagens & Multimodal", Sparkles, "image", "#EC4899")}
                </div>
            </div>

            {/* ── Section 3: Override por Módulo ── */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border)]">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                        <Settings2 size={20} className="text-cyan-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--color-text)]">Ajuste Fino por Módulo</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">Configure um motor específico para cada funcionalidade legislativa</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {modules.map((mod, idx) => {
                        const ModIcon = mod.icon;
                        const selectedProv = mod.provider === "global" ? selectedGlobal : providers.find(p => p.id === mod.provider);
                        return (
                            <div key={mod.module} className="grid grid-cols-12 gap-3 items-center p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-all">
                                <div className="col-span-12 md:col-span-4 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-[var(--color-surface-2)] flex items-center justify-center shrink-0">
                                        <ModIcon size={18} className="text-[var(--color-primary)]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-[var(--color-text)] truncate">{mod.label}</p>
                                        <p className="text-xs text-[var(--color-text-muted)] truncate">{mod.description}</p>
                                    </div>
                                </div>
                                <div className="col-span-6 md:col-span-4">
                                    <select
                                        value={mod.provider}
                                        onChange={(e) => {
                                            const newMods = [...modules];
                                            newMods[idx].provider = e.target.value;
                                            newMods[idx].model = "";
                                            setModules(newMods);
                                        }}
                                        className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
                                    >
                                        <option value="global">🌐 Usar Global ({selectedGlobal?.name})</option>
                                        {enabledProviders.map(p => (
                                            <option key={p.id} value={p.id}>{p.logo} {p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-6 md:col-span-4">
                                    <select
                                        value={mod.model || (mod.provider === "global" ? globalModel : (selectedProv?.models[0] || ""))}
                                        onChange={(e) => {
                                            const newMods = [...modules];
                                            newMods[idx].model = e.target.value;
                                            setModules(newMods);
                                        }}
                                        className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
                                    >
                                        {(selectedProv?.models || []).map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Save Floating Bar */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-8 right-8 z-50 flex items-center gap-6 p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl"
            >
                <div className="flex flex-col border-r border-[var(--color-border)] pr-6">
                    <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-widest">Motor Ativo</span>
                    <span className="text-sm font-bold text-violet-500">{selectedGlobal?.name} <span className="text-[var(--color-text-muted)] font-normal ml-1">({globalModel})</span></span>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50"
                >
                    {loading ? <RefreshCw size={20} className="animate-spin" /> : saved ? <Check size={20} /> : <Save size={20} />}
                    <span className="tracking-wide">{loading ? "SINCRONIZANDO..." : saved ? "ATUALIZADO!" : "SALVAR & APLICAR"}</span>
                </button>
            </motion.div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════

const allTabs = [
    ...services.map(s => ({ id: s.id, label: s.label, icon: s.icon, color: s.color })),
    { id: "ai", label: "Inteligência Artificial", icon: Brain, color: "#8B5CF6" },
    { id: "knowledge", label: "Base de Conhecimento", icon: Layers, color: "#6366F1" },
];

export default function IntegracoesPage() {
    const [activeTab, setActiveTab] = useState("ai");
    const [serviceStats, setServiceStats] = useState<Record<string, any>>({});

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost/api/python";
                const res = await fetch(`${apiUrl}/system/status/services`);
                if (res.ok) {
                    const data = await res.json();
                    setServiceStats(data);
                }
            } catch (error) {
                console.error("Erro ao carregar status dos serviços:", error);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 10000); // Polling cada 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center">
                    <Plug size={28} className="text-violet-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Integrações</h1>
                    <p className="text-sm text-[var(--color-text-muted)]">Gerencie todos os serviços, bancos de dados e provedores de IA configurados no sistema</p>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-[var(--color-border)] overflow-x-auto scrollbar-thin pb-1">
                <div className="flex gap-1 min-w-max pb-px">
                    {allTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap ${isActive
                                    ? "text-[var(--color-text)] border-b-2 bg-[var(--color-surface)] shadow-sm"
                                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]/50"
                                    }`}
                                style={isActive ? { borderBottomColor: tab.color } : {}}
                            >
                                <Icon size={16} style={isActive ? { color: tab.color } : {}} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 shadow-sm overflow-hidden min-h-[500px]">
                <AnimatePresence mode="wait">
                    {activeTab === "ai" ? (
                        <AITab key="ai" />
                    ) : activeTab === "knowledge" ? (
                        <KnowledgeBaseTab key="knowledge" />
                    ) : (
                        <ServiceTab key={activeTab} service={services.find(s => s.id === activeTab)!} stats={serviceStats[activeTab]} />
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Info */}
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <AlertTriangle size={14} className="text-amber-500" />
                <span>As alterações feitas nesta página são persistidas no servidor e aplicadas em tempo real.</span>
            </div>
        </div>
    );
}
