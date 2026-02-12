"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Database, Server, Cloud, Globe, Cpu, Brain, Bot, Zap,
    Shield, Key, Eye, EyeOff, Save, RotateCcw, Check, X,
    AlertTriangle, ChevronDown, Plug, Activity, Settings2,
    Sparkles, Star, Crown, ExternalLink, RefreshCw, Copy,
    Layers, Radio, HardDrive, BarChart3, MonitorDot, Network
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
        description: "Grafo de conhecimento legislativo (Graphiti KG). Plugins APOC + Graph Data Science.",
        fields: [
            { key: "uri", label: "URI (Bolt)", type: "url" as const, placeholder: "bolt://neo4j:7687", defaultValue: "bolt://neo4j:7687" },
            { key: "user", label: "Usuário", type: "text" as const, placeholder: "neo4j", defaultValue: "neo4j" },
            { key: "password", label: "Senha", type: "password" as const, placeholder: "••••••", defaultValue: "" },
            { key: "plugins", label: "Plugins", type: "text" as const, placeholder: "apoc, graph-data-science", defaultValue: "apoc, graph-data-science" },
            { key: "http_port", label: "HTTP Port", type: "text" as const, placeholder: "7474", defaultValue: "7474" },
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
        id: "openai",
        name: "OpenAI",
        logo: "🟢",
        color: "#10A37F",
        bgGradient: "from-emerald-500/10 to-emerald-600/5",
        models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "o1", "o1-mini", "o3-mini", "gpt-3.5-turbo"],
        fields: [
            { key: "api_key", label: "API Key", type: "password" as const, placeholder: "sk-..." },
            { key: "organization", label: "Organization ID", type: "text" as const, placeholder: "org-..." },
            { key: "base_url", label: "Base URL", type: "url" as const, placeholder: "https://api.openai.com/v1" },
        ],
        config: { api_key: "", organization: "", base_url: "https://api.openai.com/v1" },
        enabled: false,
    },
    {
        id: "google",
        name: "Google AI (Gemini)",
        logo: "🔵",
        color: "#4285F4",
        bgGradient: "from-blue-500/10 to-blue-600/5",
        models: ["gemini-2.0-flash", "gemini-2.0-pro", "gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.5-flash-8b"],
        fields: [
            { key: "api_key", label: "API Key", type: "password" as const, placeholder: "AIza..." },
            { key: "project_id", label: "Project ID", type: "text" as const, placeholder: "my-project-123" },
            { key: "base_url", label: "Base URL", type: "url" as const, placeholder: "https://generativelanguage.googleapis.com/v1beta" },
        ],
        config: { api_key: "AIzaSyCMaoMfDAvB8PhZCKYdkXxw9o5qIqYQYjc", project_id: "", base_url: "https://generativelanguage.googleapis.com/v1beta" },
        enabled: true,
    },
    {
        id: "anthropic",
        name: "Anthropic (Claude)",
        logo: "🟤",
        color: "#D4A574",
        bgGradient: "from-amber-500/10 to-amber-600/5",
        models: ["claude-sonnet-4-20250514", "claude-opus-4-20250514", "claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"],
        fields: [
            { key: "api_key", label: "API Key", type: "password" as const, placeholder: "sk-ant-..." },
            { key: "base_url", label: "Base URL", type: "url" as const, placeholder: "https://api.anthropic.com" },
        ],
        config: { api_key: "", base_url: "https://api.anthropic.com" },
        enabled: false,
    },
    {
        id: "deepseek",
        name: "DeepSeek",
        logo: "🐋",
        color: "#4D6BFE",
        bgGradient: "from-indigo-500/10 to-indigo-600/5",
        models: ["deepseek-chat", "deepseek-reasoner", "deepseek-coder"],
        fields: [
            { key: "api_key", label: "API Key", type: "password" as const, placeholder: "sk-..." },
            { key: "base_url", label: "Base URL", type: "url" as const, placeholder: "https://api.deepseek.com/v1" },
        ],
        config: { api_key: "", base_url: "https://api.deepseek.com/v1" },
        enabled: false,
    },
    {
        id: "kimi",
        name: "Kimi (Moonshot)",
        logo: "🌙",
        color: "#6366F1",
        bgGradient: "from-violet-500/10 to-violet-600/5",
        models: ["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"],
        fields: [
            { key: "api_key", label: "API Key", type: "password" as const, placeholder: "sk-..." },
            { key: "base_url", label: "Base URL", type: "url" as const, placeholder: "https://api.moonshot.cn/v1" },
        ],
        config: { api_key: "", base_url: "https://api.moonshot.cn/v1" },
        enabled: false,
    },
    {
        id: "mistral",
        name: "Mistral AI",
        logo: "🟠",
        color: "#F97316",
        bgGradient: "from-orange-500/10 to-orange-600/5",
        models: ["mistral-large-latest", "codestral-latest", "mistral-nemo", "mistral-small-latest", "open-mixtral-8x22b"],
        fields: [
            { key: "api_key", label: "API Key", type: "password" as const, placeholder: "..." },
            { key: "base_url", label: "Base URL", type: "url" as const, placeholder: "https://api.mistral.ai/v1" },
        ],
        config: { api_key: "", base_url: "https://api.mistral.ai/v1" },
        enabled: false,
    },
    {
        id: "groq",
        name: "Groq",
        logo: "⚡",
        color: "#F55036",
        bgGradient: "from-red-500/10 to-red-600/5",
        models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768", "gemma2-9b-it"],
        fields: [
            { key: "api_key", label: "API Key", type: "password" as const, placeholder: "gsk_..." },
            { key: "base_url", label: "Base URL", type: "url" as const, placeholder: "https://api.groq.com/openai/v1" },
        ],
        config: { api_key: "", base_url: "https://api.groq.com/openai/v1" },
        enabled: false,
    },
    {
        id: "cohere",
        name: "Cohere",
        logo: "🟣",
        color: "#D946EF",
        bgGradient: "from-fuchsia-500/10 to-fuchsia-600/5",
        models: ["command-r-plus", "command-r", "embed-multilingual-v3.0", "embed-english-v3.0"],
        fields: [
            { key: "api_key", label: "API Key", type: "password" as const, placeholder: "..." },
            { key: "base_url", label: "Base URL", type: "url" as const, placeholder: "https://api.cohere.ai/v1" },
        ],
        config: { api_key: "", base_url: "https://api.cohere.ai/v1" },
        enabled: false,
    },
    {
        id: "ollama",
        name: "Ollama (Local)",
        logo: "🦙",
        color: "#1D1D1F",
        bgGradient: "from-neutral-500/10 to-neutral-600/5",
        models: ["llama3.3", "qwen2.5", "deepseek-r1", "phi4", "mistral", "gemma2", "codellama"],
        fields: [
            { key: "base_url", label: "Base URL", type: "url" as const, placeholder: "http://localhost:11434" },
        ],
        config: { base_url: "http://localhost:11434" },
        enabled: false,
    },
];

const defaultModuleOverrides: ModuleAIOverride[] = [
    { module: "legislativo_ia", label: "Legislativo IA", description: "Geração de textos, resumos e análise jurídica", icon: Cpu, provider: "global", model: "" },
    { module: "atas_ia", label: "Atas IA", description: "Geração automática de atas de sessão plenária", icon: Bot, provider: "global", model: "" },
    { module: "deduplicacao", label: "Deduplicação", description: "Detecção de minutas duplicadas (e5-large + mmarco)", icon: Layers, provider: "global", model: "" },
    { module: "pesquisa", label: "Pesquisa Inteligente", description: "Busca semântica com embeddings em todo o acervo", icon: Sparkles, provider: "global", model: "" },
    { module: "graphiti", label: "Graphiti KG", description: "Knowledge Graph — extração de entidades legislativas", icon: Network, provider: "global", model: "" },
    { module: "workflow", label: "Workflow IA", description: "Automação de tramitação com regras inteligentes", icon: Zap, provider: "global", model: "" },
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

function ServiceTab({ service }: { service: typeof services[0] }) {
    const [config, setConfig] = useState<ServiceConfig>(() => {
        const initial: ServiceConfig = {};
        service.fields.forEach(f => { initial[f.key] = f.defaultValue || ""; });
        return initial;
    });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
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
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${service.color}15`, color: service.color }}>
                    <Activity size={12} />
                    Docker Service
                </div>
            </div>

            {/* Fields */}
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
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-all">
                    <RefreshCw size={16} />
                    Testar Conexão
                </button>
            </div>
        </motion.div>
    );
}

function AIProviderCard({ provider, onUpdate }: { provider: AIProvider; onUpdate: (p: AIProvider) => void }) {
    const [expanded, setExpanded] = useState(false);
    const [show, setShow] = useState<Record<string, boolean>>({});

    return (
        <motion.div layout className={`rounded-xl border transition-all duration-300 ${provider.enabled ? "border-[var(--color-primary)]/30 bg-gradient-to-br " + provider.bgGradient : "border-[var(--color-border)] bg-[var(--color-surface)] opacity-70"}`}>
            {/* Card Header */}
            <div className="flex items-center gap-3 p-4 cursor-pointer select-none" onClick={() => setExpanded(!expanded)}>
                <span className="text-2xl">{provider.logo}</span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-[var(--color-text)] truncate">{provider.name}</h4>
                        {provider.enabled && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">{provider.models.length} modelos disponíveis</p>
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
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Modelos Disponíveis</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {provider.models.map((model) => (
                                        <span key={model} className="px-2 py-1 text-xs rounded-md bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-border)]/50">{model}</span>
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

function AITab() {
    const [providers, setProviders] = useState<AIProvider[]>(defaultAIProviders);
    const [modules, setModules] = useState<ModuleAIOverride[]>(defaultModuleOverrides);
    const [globalProvider, setGlobalProvider] = useState("google");
    const [globalModel, setGlobalModel] = useState("gemini-2.0-flash");
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

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

                    // Update global state
                    setGlobalProvider(data.provider || "google");
                    setGlobalModel(data.model || "gemini-2.0-flash");

                    // Update provider configs (keys are masked coming back, so we only update if needed or handle logic)
                    // For security, the backend returns masked keys. 
                    // We only use them to indicate presence.
                    // Ideally we should merge with local state if we want to keep editing.
                    // For now, let's just respect the provider selection.
                    console.log("Loaded config:", data);
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
            // Prepare keys payload
            const keys: Record<string, string> = {};
            providers.forEach(p => {
                if (p.config.api_key) keys[p.id] = p.config.api_key;
            });

            const payload = {
                provider: globalProvider,
                model: globalModel,
                keys: keys
            };

            const apiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000";
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

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-8">
            {/* ── Section 1: IA Padrão Global ── */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border)]">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center">
                        <Crown size={20} className="text-violet-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--color-text)]">IA Padrão Global</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">Escolha um provedor e modelo que será usado em todos os módulos por padrão</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-gradient-to-br from-violet-500/5 to-purple-600/5 border border-violet-500/20">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Provedor Global</label>
                        <select
                            value={globalProvider}
                            onChange={(e) => {
                                setGlobalProvider(e.target.value);
                                const p = providers.find(pr => pr.id === e.target.value);
                                if (p) setGlobalModel(p.models[0]);
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                        >
                            {enabledProviders.map(p => (
                                <option key={p.id} value={p.id}>{p.logo} {p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Modelo Global</label>
                        <select
                            value={globalModel}
                            onChange={(e) => setGlobalModel(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                        >
                            {selectedGlobal?.models.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button onClick={handleApplyToAll} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-400 hover:text-violet-300 border border-violet-500/20 rounded-lg hover:bg-violet-500/10 transition-all">
                    <Sparkles size={16} />
                    Aplicar a Todos os Módulos
                </button>
            </div>

            {/* ── Section 2: Override por Módulo ── */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border)]">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                        <Settings2 size={20} className="text-cyan-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--color-text)]">Configuração por Módulo</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">Override individual — escolha provedor e modelo específicos para cada serviço de IA</p>
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

            {/* ── Section 3: Provedores de IA ── */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border)]">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 flex items-center justify-center">
                        <Brain size={20} className="text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--color-text)]">Provedores de IA</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">Configure chaves de API, URLs base e habilite/desabilite cada provedor</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {providers.map(provider => (
                        <AIProviderCard key={provider.id} provider={provider} onUpdate={handleUpdateProvider} />
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border)]">
                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-violet-500/20">
                    {saved ? <Check size={16} /> : <Save size={16} />}
                    {saved ? "Configurações Salvas!" : "Salvar Todas as Configurações de IA"}
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-all">
                    <RotateCcw size={16} />
                    Restaurar Padrão
                </button>
            </div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════

const allTabs = [
    ...services.map(s => ({ id: s.id, label: s.label, icon: s.icon, color: s.color })),
    { id: "ai", label: "Inteligência Artificial", icon: Brain, color: "#8B5CF6" },
];

export default function IntegracoesPage() {
    const [activeTab, setActiveTab] = useState("postgresql");

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
            <div className="border-b border-[var(--color-border)] overflow-x-auto scrollbar-thin">
                <div className="flex gap-1 min-w-max pb-px">
                    {allTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap ${isActive
                                    ? "text-[var(--color-text)] border-b-2 bg-[var(--color-surface)]"
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
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
                <AnimatePresence mode="wait">
                    {activeTab === "ai" ? (
                        <AITab key="ai" />
                    ) : (
                        <ServiceTab key={activeTab} service={services.find(s => s.id === activeTab)!} />
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Info */}
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <AlertTriangle size={14} />
                <span>As configurações são salvas localmente. Para produção, utilize variáveis de ambiente no arquivo <code className="px-1.5 py-0.5 rounded bg-[var(--color-surface-2)]">.env</code></span>
            </div>
        </div>
    );
}
