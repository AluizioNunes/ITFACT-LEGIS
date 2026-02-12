"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import {
    MessageSquare,
    Bot,
    X,
    Send,
    Sparkles,
    User,
    Users,
    Layers,
    Globe,
    Building,
    MessageCircle,
    Maximize2,
    Minimize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { io, Socket } from "socket.io-client";
import { format } from "date-fns";

interface Message {
    id: string;
    content: string;
    senderId: string;
    scope: 'DEPARTAMENTO' | 'ORGAO' | 'GLOBAL' | 'AI' | 'PRIVATE';
    sender: { name: string };
    createdAt: string;
}

export function AssistantWidget() {
    const { user } = useAuth();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [activeTab, setActiveTab] = useState("AI");
    const [aiInput, setAiInput] = useState("");
    const [chatInput, setChatInput] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([
        { id: '1', name: 'Ana Silva', role: 'Legislativo', status: 'online', dept: 'LEGISLATIVO', lastInteraction: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
        { id: '2', name: 'Carlos Ferreira', role: 'Jurídico', status: 'online', dept: 'JURÍDICO', lastInteraction: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
        { id: '3', name: 'Maria Santos', role: 'Administrativo', status: 'online', dept: 'ADMINISTRATIVO', lastInteraction: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
        { id: '4', name: 'João Paulo', role: 'Parlamentar', status: 'online', dept: 'GABINETE', lastInteraction: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    ]);
    const [selectedDept, setSelectedDept] = useState<string>("TODOS");
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const PAGE_TITLES: Record<string, string> = {
        "/": "Portal",
        "/dashboard": "Dashboard",
        "/dashboard/legislativo/mesa-diretora": "Mesa Diretora",
        "/dashboard/legislativo/plenario": "Plenário",
        "/dashboard/legislativo/comissoes": "Comissões",
        "/dashboard/legislativo/tramitacao": "Tramitação",
        "/dashboard/proposituras/protocolo": "Protocolo",
        "/dashboard/proposituras/pareceres": "Pareceres"
    };

    const getPageTitle = (path: string) => {
        if (PAGE_TITLES[path]) return PAGE_TITLES[path];
        // Fallback for partial matches
        const parts = path.split('/').filter(Boolean);
        if (parts.length > 0) {
            const lastPart = parts[parts.length - 1];
            return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, ' ');
        }
        return "Dashboard";
    };

    const [aiMessages, setAiMessages] = useState<Message[]>([
        {
            id: 'welcome',
            content: `Olá ${user?.name || ''}! Como posso ajudar você no módulo **${getPageTitle(pathname)}** hoje?`,
            senderId: 'ai',
            scope: 'AI',
            sender: { name: 'ASSISTENTE LEGIS' },
            createdAt: new Date().toISOString()
        }
    ]);

    // Update welcome message when path changes
    useEffect(() => {
        setAiMessages(prev => {
            if (prev.length === 1 && prev[0].id === 'welcome') {
                return [{
                    ...prev[0],
                    content: `Olá ${user?.name || ''}! Como posso ajudar você no módulo **${getPageTitle(pathname)}** hoje?`
                }];
            }
            return prev;
        });
    }, [pathname, user?.name]);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [chatScope, setChatScope] = useState<'DEPARTAMENTO' | 'ORGAO' | 'GLOBAL'>('DEPARTAMENTO');
    const [socket, setSocket] = useState<Socket | null>(null);
    const aiScrollRef = useRef<HTMLDivElement>(null);
    const chatScrollRef = useRef<HTMLDivElement>(null);

    // Chat Socket Logic
    useEffect(() => {
        if (!isOpen) return;

        const newSocket = io("http://localhost:3001/chat", {
            transports: ["websocket"],
        });

        setSocket(newSocket);

        newSocket.on("connect", () => {
            if (user?.departamentoId) newSocket.emit("joinDept", user.departamentoId);
            if (user?.orgaoId) newSocket.emit("joinOrgan", user.orgaoId);
            newSocket.emit("joinGlobal");
        });

        const handleHistory = (history: Message[]) => setChatMessages(history);
        newSocket.on("deptHistory", handleHistory);
        newSocket.on("organHistory", handleHistory);
        newSocket.on("globalHistory", handleHistory);

        newSocket.on("newMessage", (message: Message) => {
            if (message.scope === chatScope) {
                setChatMessages((prev) => [...prev, message]);
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [isOpen, user, chatScope]);

    useEffect(() => {
        if (aiScrollRef.current) aiScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }, [aiMessages]);

    useEffect(() => {
        if (chatScrollRef.current) chatScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const API_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000";

    // Fetch context suggestions when pathname changes
    useEffect(() => {
        const fetchContext = async () => {
            try {
                const res = await fetch(`${API_URL}/chat/context?path=${encodeURIComponent(pathname)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data.suggestions || []);
                }
            } catch (error) {
                console.error("Failed to fetch context:", error);
            }
        };
        fetchContext();
    }, [pathname]);

    const sendAiMessage = async (content?: string) => {
        const msgContent = content || aiInput.trim();
        if (!msgContent) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            content: msgContent,
            senderId: user?.id || 'dev',
            scope: 'AI',
            sender: { name: user?.name || 'VOCÊ' },
            createdAt: new Date().toISOString()
        };

        setAiMessages(prev => [...prev, userMsg]);
        setAiInput("");
        setIsAiLoading(true);

        try {
            const res = await fetch(`${API_URL}/chat/query`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: msgContent,
                    context_path: pathname
                })
            });

            const data = await res.json();

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                content: data.response || "Mmm, não consegui processar isso agora.",
                senderId: 'ai',
                scope: 'AI',
                sender: { name: 'ASSISTENTE LEGIS' },
                createdAt: new Date().toISOString()
            };
            setAiMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                content: "Desculpe, estou enfrentando problemas de conexão com minha base de conhecimento.",
                senderId: 'ai',
                scope: 'AI',
                sender: { name: 'ASSISTENTE LEGIS' },
                createdAt: new Date().toISOString()
            };
            setAiMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsAiLoading(false);
        }
    };

    const sendChatMessage = () => {
        if (!chatInput.trim() || !user) return;

        const newMsg: Message = {
            id: Date.now().toString(),
            content: chatInput.trim(),
            senderId: user.id,
            scope: selectedUser ? 'PRIVATE' : chatScope,
            sender: { name: user.name || 'Você' },
            createdAt: new Date().toISOString()
        };

        // Optimistic update for UI visibility
        setChatMessages(prev => [...prev, newMsg]);

        if (socket) {
            socket.emit("sendMessage", {
                content: chatInput.trim(),
                senderId: user.id,
                targetId: selectedUser?.id, // For private chat
                scope: selectedUser ? 'PRIVATE' : chatScope,
                orgaoId: user.orgaoId,
                departamentoId: user.departamentoId,
            });
        }

        // Update last interaction for local sorting visualization
        setOnlineUsers(prev => prev.map(u =>
            u.name === user.name ? { ...u, lastInteraction: new Date().toISOString() } : u
        ));

        setChatInput("");
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && !isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="mb-4 w-[480px] h-[780px] origin-bottom-right"
                    >
                        <Card className="h-full flex flex-col shadow-[0_25px_60px_rgba(30,58,138,0.25)] border-blue-200/50 bg-white overflow-hidden rounded-3xl">
                            <CardHeader className="p-6 bg-blue-600 text-white flex flex-row items-center justify-between shrink-0 shadow-md relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-90" />
                                <div className="relative z-10 flex items-center gap-3">
                                    <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md border border-white/20">
                                        <Sparkles className="h-5 w-5 text-white animate-pulse" />
                                    </div>
                                    <div className="flex flex-col">
                                        <CardTitle className="text-sm font-bold tracking-wider uppercase">ASSISTENTE LEGIS</CardTitle>
                                        <span className="text-[9px] font-medium text-blue-100 uppercase opacity-80">Câmara Municipal</span>
                                    </div>
                                </div>
                                <div className="relative z-10 flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-white/15 rounded-xl transition-colors" onClick={() => setIsMinimized(true)}>
                                        <Minimize2 className="h-4.5 w-4.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-white/25 rounded-xl transition-colors" onClick={() => setIsOpen(false)}>
                                        <X className="h-4.5 w-4.5" />
                                    </Button>
                                </div>
                            </CardHeader>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                                <TabsList className="grid w-full grid-cols-2 h-14 rounded-none bg-blue-50/50 border-b p-1.5 uppercase">
                                    <TabsTrigger value="AI" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 transition-all flex gap-2 text-[10px] font-bold tracking-widest">
                                        <Bot className="h-4 w-4" /> AJUDA IA
                                    </TabsTrigger>
                                    <TabsTrigger value="TEAM" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 transition-all flex gap-2 text-[10px] font-bold tracking-widest">
                                        <Users className="h-4 w-4" /> CHAT EQUIPE
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="AI" className="flex-1 flex flex-col m-0 p-0 overflow-hidden bg-gradient-to-b from-transparent to-muted/10">
                                    <ScrollArea className="flex-1 p-5 min-h-0">
                                        <div className="space-y-6">
                                            {aiMessages.map((msg) => (
                                                <div key={msg.id} className={`flex ${msg.senderId === 'ai' ? "justify-start" : "justify-end"}`}>
                                                    <div className={`flex gap-3 max-w-[85%] ${msg.senderId !== 'ai' ? "flex-row-reverse" : ""}`}>
                                                        <Avatar className="h-8 w-8 border shadow-sm">
                                                            <AvatarFallback className={msg.senderId === 'ai' ? "bg-primary/10 text-primary text-[10px] font-bold" : "bg-muted text-[10px] font-bold"}>
                                                                {msg.senderId === 'ai' ? <Bot className="h-4 w-4" /> : msg.sender.name.substring(0, 1).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm whitespace-pre-wrap ${msg.senderId === 'ai'
                                                            ? "bg-card border border-border rounded-tl-none text-foreground"
                                                            : "bg-primary text-primary-foreground rounded-tr-none font-medium"
                                                            }`}>
                                                            {msg.content}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {isAiLoading && (
                                                <div className="flex justify-start">
                                                    <div className="flex gap-3 max-w-[85%]">
                                                        <Avatar className="h-8 w-8 border shadow-sm">
                                                            <AvatarFallback className="bg-primary/10 text-primary"><Bot className="h-4 w-4" /></AvatarFallback>
                                                        </Avatar>
                                                        <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-card border border-border">
                                                            <div className="flex gap-1">
                                                                <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                                <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                                <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div ref={aiScrollRef} />
                                        </div>
                                    </ScrollArea>

                                    {/* Context Suggestions */}
                                    {suggestions.length > 0 && (
                                        <div className="px-5 py-2 flex gap-2 overflow-x-auto no-scrollbar bg-blue-50/30 border-t border-blue-100/50">
                                            {suggestions.map((s, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => sendAiMessage(s)}
                                                    className="shrink-0 text-[10px] px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium whitespace-nowrap shadow-sm"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <div className="p-5 border-t bg-white">
                                        <div className="flex gap-2 p-2 rounded-2xl border border-blue-100 bg-blue-50/30 shadow-inner focus-within:ring-2 ring-blue-500/10 transition-all">
                                            <Input
                                                placeholder="Pergunte sobre esta tela..."
                                                className="border-none bg-transparent shadow-none font-medium text-[13px] placeholder:text-blue-400/50 h-10"
                                                value={aiInput}
                                                onChange={(e) => setAiInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && sendAiMessage()}
                                                disabled={isAiLoading}
                                            />
                                            <Button size="icon" className="shrink-0 h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all" onClick={() => sendAiMessage()} disabled={isAiLoading}>
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="TEAM" className="flex-1 flex flex-col m-0 p-0 overflow-hidden bg-gradient-to-b from-transparent to-muted/10">
                                    <div className="flex flex-col border-b bg-white">
                                        <div className="px-5 py-3 bg-blue-50/50 flex gap-2 overflow-x-auto no-scrollbar">
                                            {(['DEPARTAMENTO', 'ORGAO', 'GLOBAL'] as const).map((s) => (
                                                <Button
                                                    key={s}
                                                    variant={chatScope === s && !selectedUser ? "default" : "outline"}
                                                    size="sm"
                                                    className={`h-8 text-[9px] px-4 font-bold uppercase tracking-widest rounded-full transition-all shrink-0 ${chatScope === s && !selectedUser ? "bg-blue-600 hover:bg-blue-700 border-transparent shadow-md" : "border-blue-200 text-blue-600 hover:bg-blue-50"
                                                        }`}
                                                    onClick={() => {
                                                        setChatScope(s);
                                                        setSelectedUser(null);
                                                    }}
                                                >
                                                    {s === 'DEPARTAMENTO' ? 'SETOR' : s === 'ORGAO' ? 'ÓRGÃO' : 'GERAL'}
                                                </Button>
                                            ))}
                                            {selectedUser && (
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="h-8 text-[9px] px-4 font-bold uppercase tracking-widest rounded-full bg-green-600 hover:bg-green-700 shrink-0 shadow-md"
                                                >
                                                    DM: {selectedUser.name.split(' ')[0]}
                                                </Button>
                                            )}
                                        </div>
                                        <div className="px-5 py-2.5 bg-blue-600/[0.03] flex items-center justify-between border-t border-b">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold uppercase text-blue-700 tracking-widest leading-none mb-1.5">FILTRAR USUÁRIOS</span>
                                                <Select value={selectedDept} onValueChange={setSelectedDept}>
                                                    <SelectTrigger className="h-7 w-36 text-[9px] uppercase font-bold bg-white border-blue-200 focus:ring-blue-500/20 shadow-sm">
                                                        <SelectValue placeholder="SETOR" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-blue-100">
                                                        <SelectItem value="TODOS" className="text-[10px] uppercase font-bold text-blue-800">TODOS SETORES</SelectItem>
                                                        <SelectItem value="LEGISLATIVO" className="text-[10px] uppercase font-bold">LEGISLATIVO</SelectItem>
                                                        <SelectItem value="JURÍDICO" className="text-[10px] uppercase font-bold">JURÍDICO</SelectItem>
                                                        <SelectItem value="ADMINISTRATIVO" className="text-[10px] uppercase font-bold">ADMINISTRATIVO</SelectItem>
                                                        <SelectItem value="GABINETE" className="text-[10px] uppercase font-bold">GABINETE</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <span className="text-[10px] bg-blue-600 text-white px-2.5 py-1 rounded-full font-bold shadow-sm">
                                                {onlineUsers.filter(u => selectedDept === 'TODOS' || u.dept === selectedDept).length}
                                            </span>
                                        </div>
                                        <ScrollArea className="h-28 border-b bg-white">
                                            <div className="flex gap-5 p-5 items-center">
                                                {onlineUsers
                                                    .filter(u => selectedDept === 'TODOS' || u.dept === selectedDept)
                                                    .sort((a, b) => new Date(b.lastInteraction).getTime() - new Date(a.lastInteraction).getTime())
                                                    .map((u) => (
                                                        <div key={u.id} className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer" onClick={() => setSelectedUser(u)}>
                                                            <div className="relative">
                                                                <Avatar className={`h-12 w-12 border-2 transition-all shadow-sm ${selectedUser?.id === u.id ? "border-green-500 scale-110 ring-4 ring-green-100" : "border-blue-100 group-hover:border-blue-400 group-hover:shadow-md"}`}>
                                                                    <AvatarFallback className={`text-xs font-bold ${selectedUser?.id === u.id ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-600"}`}>{u.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                                                            </div>
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-[9px] font-bold uppercase text-slate-700 leading-none mb-0.5">{u.name.split(' ')[0]}</span>
                                                                <span className="text-[7px] font-medium text-slate-400 uppercase tracking-tighter">{u.dept}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                    <ScrollArea className="flex-1 p-5">
                                        <div className="space-y-4">
                                            {chatMessages.map((msg) => (
                                                <div key={msg.id} className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}>
                                                    <div className="flex flex-col gap-1.5 max-w-[85%]">
                                                        {msg.senderId !== user?.id && (
                                                            <span className="text-[9px] text-blue-700 font-bold uppercase tracking-wider px-1">{msg.sender.name}</span>
                                                        )}
                                                        <div className={`px-4 py-2.5 rounded-2xl text-[12.5px] shadow-sm leading-relaxed ${msg.senderId === user?.id
                                                            ? "bg-blue-600 text-white rounded-tr-none font-medium"
                                                            : "bg-blue-50/80 border border-blue-100 text-slate-800 rounded-tl-none"
                                                            }`}>
                                                            {msg.content}
                                                        </div>
                                                        <span className="text-[8px] text-slate-400 px-2 self-end font-medium">
                                                            {format(new Date(msg.createdAt), "HH:mm")}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={chatScrollRef} />
                                        </div>
                                    </ScrollArea>
                                    <div className="p-5 border-t bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
                                        <div className="flex gap-2 p-2 rounded-2xl border border-blue-100 bg-blue-50/30 shadow-inner focus-within:ring-2 ring-blue-500/10 transition-all">
                                            <Input
                                                placeholder={selectedUser ? `MENSAGEM PRIVADA PARA ${selectedUser.name.split(' ')[0]}...` : "Mensagem para a equipe..."}
                                                className="border-none bg-transparent shadow-none font-medium text-[13px] placeholder:text-blue-400/50 h-10"
                                                value={chatInput}
                                                onChange={(e) => setChatInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                                            />
                                            <Button size="icon" className="shrink-0 h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all" onClick={sendChatMessage}>
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-row items-center gap-3">
                {isMinimized && isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl shadow-xl shadow-blue-200 text-xs font-bold uppercase tracking-widest flex items-center gap-3 cursor-pointer transition-all active:scale-95 border border-blue-400/20"
                        onClick={() => setIsMinimized(false)}
                    >
                        <Maximize2 className="h-4.5 w-4.5" /> RESTAURAR CHAT
                    </motion.div>
                )}

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        if (isMinimized) setIsMinimized(false);
                        else setIsOpen(!isOpen);
                    }}
                    className={`h-16 w-16 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200 transition-all duration-500 ring-4 ring-white/50 ${isOpen ? "bg-red-500 rotate-90" : "bg-gradient-to-br from-blue-500 to-blue-700 animate-gradient-slow"
                        }`}
                >
                    {isOpen && !isMinimized ? (
                        <X className="text-white h-8 w-8" />
                    ) : (
                        <div className="relative">
                            <Sparkles className="text-white h-8 w-8 animate-pulse shadow-white" />
                            <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                                <span className="text-[9px] font-bold text-white">3</span>
                            </div>
                        </div>
                    )}
                </motion.button>
            </div>
        </div >
    );
}
