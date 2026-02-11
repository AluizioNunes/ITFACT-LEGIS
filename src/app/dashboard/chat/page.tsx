"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth"; // Assuming an auth hook exists
import { io, Socket } from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Hash, Users, Building, Globe, Layers } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
    id: string;
    content: string;
    senderId: string;
    scope: 'DEPARTAMENTO' | 'ORGAO' | 'GLOBAL';
    sender: { name: string };
    createdAt: string;
}

export default function ChatPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [scope, setScope] = useState<'DEPARTAMENTO' | 'ORGAO' | 'GLOBAL'>('DEPARTAMENTO');
    const [input, setInput] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial connection
    useEffect(() => {
        const newSocket = io("http://localhost:3001/chat", {
            transports: ["websocket"],
        });

        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Connected to chat socket");
            if (user?.departamentoId) newSocket.emit("joinDept", user.departamentoId);
            if (user?.orgaoId) newSocket.emit("joinOrgan", user.orgaoId);
            newSocket.emit("joinGlobal");
        });

        const handleHistory = (history: Message[]) => setMessages(history);

        newSocket.on("deptHistory", handleHistory);
        newSocket.on("organHistory", handleHistory);
        newSocket.on("globalHistory", handleHistory);

        newSocket.on("newMessage", (message: Message) => {
            if (message.scope === scope) {
                setMessages((prev) => [...prev, message]);
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user, scope]);

    // Handle scope change
    const onScopeChange = (newScope: string) => {
        const s = newScope as 'DEPARTAMENTO' | 'ORGAO' | 'GLOBAL';
        setScope(s);
        if (socket) {
            if (s === 'DEPARTAMENTO') socket.emit("joinDept", user?.departamentoId);
            if (s === 'ORGAO') socket.emit("joinOrgan", user?.orgaoId);
            if (s === 'GLOBAL') socket.emit("joinGlobal");
        }
    };

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim() || !socket || !user) return;

        socket.emit("sendMessage", {
            content: input.trim(),
            senderId: user.id,
            scope,
            orgaoId: user.orgaoId,
            departamentoId: user.departamentoId,
        });

        setInput("");
    };

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] max-w-5xl mx-auto space-y-4">
            <Tabs defaultValue="DEPARTAMENTO" onValueChange={onScopeChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="DEPARTAMENTO" className="flex gap-2">
                        <Layers className="h-4 w-4" /> Setor
                    </TabsTrigger>
                    <TabsTrigger value="ORGAO" className="flex gap-2">
                        <Building className="h-4 w-4" /> Órgão
                    </TabsTrigger>
                    <TabsTrigger value="GLOBAL" className="flex gap-2">
                        <Globe className="h-4 w-4" /> Geral
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <Card className="flex-1 flex flex-col overflow-hidden border-none shadow-xl bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b bg-muted/30 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                {scope === 'DEPARTAMENTO' ? <Hash className="h-5 w-5 text-primary" /> :
                                    scope === 'ORGAO' ? <Building className="h-5 w-5 text-primary" /> :
                                        <Globe className="h-5 w-5 text-primary" />}
                            </div>
                            <div>
                                <CardTitle className="text-lg">
                                    {scope === 'DEPARTAMENTO' ? "Chat do Setor" :
                                        scope === 'ORGAO' ? "Chat Institucional (Órgão)" :
                                            "Chat Inter-Institucional (Geral)"}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {messages.length} mensagens no histórico
                                </p>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {messages.map((msg, i) => {
                                const isMe = msg.senderId === user?.id;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`flex gap-3 max-w-[80%] ${isMe ? "flex-row-reverse" : ""}`}>
                                            <Avatar className="h-8 w-8 border-2 border-background">
                                                <AvatarFallback className="text-[10px] bg-primary/20 text-primary font-bold">
                                                    {msg.sender.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <div className={`flex items-baseline gap-2 mb-1 ${isMe ? "flex-row-reverse" : ""}`}>
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                                        {msg.sender.name}
                                                    </span>
                                                    <span className="text-[9px] text-muted-foreground/60">
                                                        {format(new Date(msg.createdAt), "HH:mm")}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${isMe
                                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                                        : "bg-muted text-foreground rounded-tl-none"
                                                        }`}
                                                >
                                                    {msg.content}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>

                    <div className="p-4 bg-muted/20 border-t">
                        <div className="flex gap-2 bg-background p-1.5 rounded-xl border shadow-inner focus-within:ring-2 ring-primary/20 transition-all">
                            <Input
                                placeholder="Digite sua mensagem..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                className="border-none bg-transparent focus-visible:ring-0 shadow-none h-10"
                            />
                            <Button
                                size="icon"
                                onClick={sendMessage}
                                className="h-10 w-10 rounded-lg shadow-md transition-transform active:scale-95"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
