"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    LayoutDashboard,
    FileText,
    ArrowRightLeft,
    Edit3,
    Scale,
    PenTool,
    Archive,
    Library,
    Users,
    Gavel,
    BarChart2,
    Settings,
    Search,
    Bell,
    Globe,
    HelpCircle,
    ChevronDown,
    ChevronRight,
    LogOut,
    Menu,
    Building2,
    Briefcase,
    Shield,
    User,
    MessageCircle,
    Plug
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/contexts/UIContext";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

type MenuItem = {
    title: string;
    icon: React.ElementType;
    href?: string;
    badge?: number;
    submenu?: (MenuItemChild | MenuItem)[];
};

type MenuItemChild = {
    title: string;
    href: string;
    badge?: number;
};

const menuItems: MenuItem[] = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
    },
    {
        title: "Poder Legislativo",
        icon: Gavel,
        submenu: [
            { title: "Vereadores (Analítico)", href: "/dashboard/legislativo/vereadores" },
            { title: "Mesa Diretora (BI)", href: "/dashboard/legislativo/mesa-diretora" },
            { title: "Comissões (Painel)", href: "/dashboard/legislativo/comissoes/permanentes" },
            { title: "Sessões Plenárias", href: "/dashboard/sessoes" },
            { title: "Painel de Votação", href: "/dashboard/sessoes/painel" },
            { title: "Sessão ao Vivo", href: "/dashboard/sessoes/ao-vivo" },
            { title: "Ordem do Dia", href: "/dashboard/sessoes/ordem-do-dia" },
            { title: "Presença Eletrônica", href: "/dashboard/sessoes/presenca" },
            { title: "Tribuna Popular", href: "/dashboard/sessoes/tribuna" },
            { title: "Orçamento (Analítico)", href: "/dashboard/legislativo/orcamento" },
            { title: "Legislação & Leis", href: "/dashboard/legislativo/legislacao" },
            { title: "Proposituras", href: "/dashboard/proposituras" },
            { title: "Tramitação Digital", href: "/dashboard/proposituras/tramitacao" },
            { title: "Workflow IA", href: "/dashboard/proposituras/workflow" },
            { title: "Emendas", href: "/dashboard/proposituras/emendas" },
            { title: "Pareceres", href: "/dashboard/proposituras/pareceres" },
            { title: "Vetos", href: "/dashboard/proposituras/vetos" },
            { title: "Discussões", href: "/dashboard/proposituras/discussoes" },
            { title: "Redação Final", href: "/dashboard/proposituras/redacao-final" },
            { title: "Versioning (Git de Leis)", href: "/dashboard/proposituras/versioning" },
            { title: "Moções", href: "/dashboard/legislativo/mocoes" },
            { title: "Honrarias & Comendas", href: "/dashboard/legislativo/honrarias" },
            { title: "TCE-AM (Tribunal de Contas)", href: "/dashboard/legislativo/tce-am" },
            { title: "Alertas de Prazo", href: "/dashboard/alertas" },
            { title: "Analytics IA", href: "/dashboard/analytics" },
        ],
    },
    {
        title: "Gestão & Social",
        icon: Users,
        submenu: [
            { title: "Ouvidoria (Social)", href: "/dashboard/ouvidoria" },
            { title: "Recursos Humanos", href: "/dashboard/administrativo/rh" },
            { title: "Patrimônio (Ativos)", href: "/dashboard/administrativo/patrimonio" },
            { title: "Corregedoria Ética", href: "/dashboard/corregedoria" },
            { title: "Diário Oficial (DOLM)", href: "/dashboard/publicacoes" },
            { title: "Audiências Públicas", href: "/dashboard/legislativo/audiencias" },
            { title: "Licenças Vereadores", href: "/dashboard/legislativo/licencas" },
            { title: "Portal do Cidadão", href: "/dashboard/portal/cidadao" },
        ],
    },



    {
        title: "Protocolos",
        icon: FileText,
        submenu: [
            { title: "Pesquisa Geral", href: "/dashboard/protocolos" },
            { title: "Entrada", href: "/dashboard/protocolos/entrada" },
            { title: "Saída", href: "/dashboard/protocolos/saida" },
            { title: "Pesquisa", href: "/dashboard/protocolos/pesquisa" },
            { title: "Relatórios", href: "/dashboard/protocolos/relatorios" },
        ],
    },
    {
        title: "Administrativo",
        icon: Archive,
        submenu: [
            {
                title: "Tramitação",
                icon: ArrowRightLeft,
                badge: 12,
                submenu: [
                    { title: "Recebida", href: "/dashboard/tramitacao/recebida", badge: 5 },
                    { title: "Enviada", href: "/dashboard/tramitacao/enviada", badge: 7 },
                    { title: "Histórico", href: "/dashboard/tramitacao/historico" },
                    { title: "Prazos", href: "/dashboard/tramitacao/prazos", badge: 3 },
                    { title: "Sobrestamento", href: "/dashboard/tramitacao/sobrestamento" },
                ],
            },
            {
                title: "Minutas",
                icon: Edit3,
                submenu: [
                    { title: "Minhas Minutas", href: "/dashboard/minutas" },
                    { title: "Aprovação", href: "/dashboard/minutas/aprovacao" },
                    { title: "Expedição", href: "/dashboard/minutas/expedicao" },
                    { title: "Deduplicação IA", href: "/dashboard/minutas/deduplicacao" },
                ],
            },
            {
                title: "Assinaturas",
                icon: PenTool,
                submenu: [
                    { title: "Para Assinar", href: "/dashboard/assinaturas/assinar" },
                    { title: "Validar", href: "/dashboard/assinaturas/validar" },
                    { title: "Relatórios", href: "/dashboard/assinaturas/relatorios" },
                ],
            },
            {
                title: "Arquivo Geral",
                icon: Archive,
                submenu: [
                    { title: "Gestão", href: "/dashboard/arquivo" },
                    { title: "Caixas", href: "/dashboard/arquivo/caixas" },
                    { title: "Empréstimos", href: "/dashboard/arquivo/emprestimos" },
                    { title: "Eliminação", href: "/dashboard/arquivo/eliminacao" },
                    { title: "Inventário", href: "/dashboard/arquivo/inventario" },
                ],
            },
            {
                title: "Relatórios",
                icon: BarChart2,
                submenu: [
                    { title: "Gerenciais", href: "/dashboard/relatorios/gerenciais" },
                    { title: "Estatísticas", href: "/dashboard/relatorios/estatisticas" },
                    { title: "Dashboards", href: "/dashboard/relatorios/dashboards" },
                ],
            },
        ],
    },
    {
        title: "Sistema",
        icon: Settings,
        submenu: [
            { title: "Casa Principal", icon: Building2, href: "/dashboard/sistema/casa" },
            { title: "Gabinetes", icon: Briefcase, href: "/dashboard/sistema/gabinetes" },
            { title: "Departamentos", icon: Settings, href: "/dashboard/sistema/departamentos" },
            { title: "Servidores", icon: Users, href: "/dashboard/sistema/servidores" },
            { title: "Permissões", icon: Shield, href: "/dashboard/sistema/permissoes" },
            { title: "Perfil", icon: User, href: "/dashboard/perfil" },
            {
                title: "Portal Externo",
                icon: Globe,
                submenu: [
                    { title: "Usuários Externos", href: "/dashboard/portal/usuarios" },
                    { title: "Consulta Pública", href: "/dashboard/portal/consulta" },
                ],
            },
            { title: "Pesquisa IA", icon: Search, href: "/dashboard/pesquisa-inteligente" },
            { title: "Integrações", icon: Plug, href: "/dashboard/sistema/integracoes" },
            { title: "Notificações", icon: Bell, href: "/dashboard/notificacoes", badge: 8 },
            {
                title: "Ajuda",
                icon: HelpCircle,
                submenu: [
                    { title: "Central de Ajuda", href: "/dashboard/ajuda" },
                    { title: "Manual", href: "/dashboard/ajuda/manual" },
                    { title: "Tutoriais", href: "/dashboard/ajuda/tutoriais" },
                    { title: "FAQ", href: "/dashboard/ajuda/faq" },
                ],
            },
        ],
    },
];

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const { isSidebarCollapsed: isCollapsed, toggleSidebar } = useUI();
    const [mounted, setMounted] = React.useState(false);
    const [openSubmenus, setOpenSubmenus] = React.useState<Record<string, boolean>>({});
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const toggleSubmenu = (title: string) => {
        setOpenSubmenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    if (!mounted) {
        return (
            <div className={cn(
                "hidden lg:flex flex-col border-r bg-white h-screen sticky top-0 z-50 overflow-hidden",
                isCollapsed ? "w-[70px]" : "w-[256px]",
                className
            )} />
        );
    }

    return (
        <>
            <motion.div
                animate={{ width: isCollapsed ? 70 : 256 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className={cn(
                    "hidden lg:flex flex-col border-r bg-white h-screen sticky top-0 z-50 overflow-hidden",
                    className
                )}
            >
                {/* Header Area with Toggle */}
                <div className={cn(
                    "flex items-center border-b h-16 min-h-[64px] shrink-0 overflow-hidden",
                    isCollapsed ? "justify-center" : "justify-between px-6"
                )}>
                    {!isCollapsed && (
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xl font-bold text-blue-900 tracking-tighter whitespace-nowrap"
                        >
                            ITFACT <span className="text-blue-500">LEGIS</span>
                        </motion.h1>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "text-blue-900 hover:bg-blue-50 transition-all rounded-xl",
                            isCollapsed ? "h-10 w-10" : "h-8 w-8 ml-2"
                        )}
                        onClick={toggleSidebar}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>

                <ScrollArea className="flex-1 px-3">
                    <nav className="space-y-1.5 py-6">
                        <TooltipProvider delayDuration={0}>
                            {menuItems.map((item) => (
                                <div key={item.title}>
                                    {isCollapsed ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="relative">
                                                    {item.submenu ? (
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className={cn(
                                                                        "h-10 w-10 mx-auto flex items-center justify-center rounded-xl transition-all hover:bg-blue-50 hover:text-blue-600",
                                                                        openSubmenus[item.title] && "bg-blue-50 text-blue-600"
                                                                    )}
                                                                >
                                                                    <item.icon className="h-5 w-5" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent side="right" align="start" className="w-56 p-2 rounded-xl shadow-xl border-blue-100 uppercase">
                                                                <div className="px-3 py-2 border-b mb-1">
                                                                    <span className="text-[10px] font-bold text-blue-900 tracking-widest">{item.title}</span>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    {item.submenu.map((sub: any) => (
                                                                        <Link
                                                                            key={sub.href || sub.title}
                                                                            href={sub.href || "#"}
                                                                            className={cn(
                                                                                "flex items-center px-3 py-2 text-[10px] font-bold rounded-lg transition-colors hover:bg-blue-50 hover:text-blue-700",
                                                                                pathname === sub.href ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-600"
                                                                            )}
                                                                        >
                                                                            {sub.title}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                    ) : (
                                                        <Link href={item.href || "#"}>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className={cn(
                                                                    "h-10 w-10 mx-auto flex items-center justify-center rounded-xl transition-all hover:bg-blue-50 hover:text-blue-600",
                                                                    pathname === item.href && "bg-blue-600 text-white shadow-md shadow-blue-200"
                                                                )}
                                                            >
                                                                <item.icon className="h-5 w-5" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="font-bold text-[10px] uppercase tracking-widest bg-slate-900 border-none">
                                                {item.title}
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        /* Expanded Mode */
                                        <div>
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    "w-full justify-start h-10 px-4 rounded-xl transition-all hover:bg-blue-50 group",
                                                    (openSubmenus[item.title] || pathname === item.href) && "bg-blue-50 text-blue-700"
                                                )}
                                                onClick={() => item.submenu ? toggleSubmenu(item.title) : undefined}
                                                asChild={!item.submenu}
                                            >
                                                {item.submenu ? (
                                                    <div className="flex items-center justify-between w-full pointer-events-none">
                                                        <div className="flex items-center gap-3">
                                                            <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", openSubmenus[item.title] ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500")} />
                                                            <span className="text-[11px] font-bold tracking-wider uppercase">{item.title}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {item.badge && (
                                                                <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                                                                    {item.badge}
                                                                </span>
                                                            )}
                                                            <ChevronRight className={cn("h-3.5 w-3.5 transition-transform duration-200", openSubmenus[item.title] && "rotate-90")} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Link href={item.href || "#"} className="flex items-center gap-3 w-full">
                                                        <item.icon className={cn("h-4 w-4 shrink-0", pathname === item.href ? "text-blue-600" : "text-slate-400")} />
                                                        <span className="text-[11px] font-bold tracking-wider uppercase">{item.title}</span>
                                                        {item.badge && (
                                                            <span className="ml-auto text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </Link>
                                                )}
                                            </Button>

                                            <AnimatePresence initial={false}>
                                                {openSubmenus[item.title] && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="ml-4 pl-4 border-l border-blue-100 my-1.5 space-y-1">
                                                            {item.submenu?.map((sub: any) => (
                                                                <Link
                                                                    key={sub.href || sub.title}
                                                                    href={sub.href || "#"}
                                                                    className={cn(
                                                                        "flex items-center px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide rounded-lg transition-all hover:bg-blue-50 hover:text-blue-700",
                                                                        pathname === sub.href ? "bg-blue-50 text-blue-700 border-l-2 border-blue-600 rounded-l-none" : "text-slate-500"
                                                                    )}
                                                                >
                                                                    {sub.title}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </TooltipProvider>
                    </nav>
                </ScrollArea>

                <div className="p-4 border-t">
                    <Button variant="ghost" className={cn("w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive", isCollapsed && "justify-center px-0")}>
                        <LogOut className="h-4 w-4" />
                        {!isCollapsed && <span className="uppercase text-xs font-semibold">Sair</span>}
                    </Button>
                </div>
            </motion.div>

            {/* Mobile Sidebar Trigger */}
            <div className="lg:hidden fixed bottom-4 right-4 z-50">
                <Button size="icon" className="h-12 w-12 rounded-full shadow-lg" onClick={() => setIsMobileOpen(true)}>
                    <Menu className="h-6 w-6" />
                </Button>
            </div>
        </>
    );
}
