"use client";

import { Bell, Search, User, Moon, Sun, Monitor, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUI } from "@/contexts/UIContext";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import * as React from "react";



export function Navbar() {
    const { setTheme } = useTheme();
    const { toggleSidebar, setIsMobileOpen } = useUI();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 bg-muted/50 px-6 backdrop-blur support-[backdrop-filter]:bg-muted/50">
                <div className="container flex h-14 items-center gap-4 px-6 max-w-full">
                    <div className="flex-1" />
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-md bg-muted animate-pulse" />
                        <div className="h-9 w-9 rounded-md bg-muted animate-pulse" />
                        <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all duration-300 shadow-sm">
            <div className="container flex h-14 items-center gap-4 px-6 max-w-full">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-900 hover:bg-blue-50 transition-all rounded-xl"
                        onClick={() => {
                            // On mobile, setIsMobileOpen(true)
                            // On desktop, toggleSidebar()
                            if (window.innerWidth < 1024) {
                                setIsMobileOpen(true);
                            } else {
                                toggleSidebar();
                            }
                        }}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h2 className="text-sm font-bold text-blue-900 dark:text-blue-100 hidden lg:block tracking-tight uppercase">
                        ITFACT LEGIS - SISTEMA DE GESTÃO ADMINISTRATIVA E LEGISLATIVA
                    </h2>
                </div>
                <div className="flex flex-1 items-center gap-4 md:gap-8 justify-end">
                    <div className="relative flex-1 max-w-md hidden md:flex">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Pesquisar protocolos, documentos..."
                            className="w-full rounded-lg bg-background border border-input pl-9 pr-4 h-9 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                <Sun className="mr-2 h-4 w-4" />
                                <span>Claro</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                <Moon className="mr-2 h-4 w-4" />
                                <span>Escuro</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                <Monitor className="mr-2 h-4 w-4" />
                                <span>Sistema</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative h-9 w-9">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="flex flex-col gap-1 p-1">
                                <DropdownMenuItem className="cursor-pointer flex flex-col items-start gap-1 p-2">
                                    <div className="flex w-full justify-between items-center">
                                        <span className="font-semibold text-sm">Protocolo #12345</span>
                                        <span className="text-xs text-muted-foreground">2 min atrás</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Novo protocolo recebido do Setor Jurídico.</p>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer flex flex-col items-start gap-1 p-2">
                                    <div className="flex w-full justify-between items-center">
                                        <span className="font-semibold text-sm">Prazo Vencendo</span>
                                        <span className="text-xs text-muted-foreground text-red-500">Urgente</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">PL 45/2026 vence hoje às 18:00.</p>
                                </DropdownMenuItem>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="w-full text-center justify-center font-medium text-primary cursor-pointer">
                                Ver todas
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User Profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">Administrador</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        admin@cmm.am.gov.br
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Meu Perfil</DropdownMenuItem>
                            <DropdownMenuItem>Configurações</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                                Sair do Sistema
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
