"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Award,
    Plus,
    History
} from "lucide-react";

// Mock Data for Mesa Diretora Composition
const mesaMembers = [
    {
        cargo: "PRESIDENTE",
        parlamentar: "Ver. Caio André",
        partido: "UNIAO",
        foto: "/placeholder-president.jpg", // Replace with real URL
        biografia: "Presidente da Câmara Municipal de Manaus para o biênio 2023-2024.",
        cor: "bg-blue-600"
    },
    {
        cargo: "1º VICE-PRESIDENTE",
        parlamentar: "Ver. Yomara Lins",
        partido: "PRTB",
        foto: "",
        biografia: "",
        cor: "bg-blue-500"
    },
    {
        cargo: "2º VICE-PRESIDENTE",
        parlamentar: "Ver. Everton Assis",
        partido: "UNIAO",
        foto: "",
        biografia: "",
        cor: "bg-blue-500"
    },
    {
        cargo: "3º VICE-PRESIDENTE",
        parlamentar: "Ver. Demétrio",
        partido: "PSDB",
        foto: "",
        biografia: "",
        cor: "bg-blue-500"
    },
    {
        cargo: "SECRETÁRIO GERAL",
        parlamentar: "Ver. João Carlos",
        partido: "REPUBLICANOS",
        foto: "",
        biografia: "",
        cor: "bg-slate-600"
    },
    {
        cargo: "1º SECRETÁRIO",
        parlamentar: "Ver. Glória Carratte",
        partido: "PL",
        foto: "",
        biografia: "",
        cor: "bg-slate-500"
    },
    {
        cargo: "2º SECRETÁRIO",
        parlamentar: "Ver. Jaildo Oliveira",
        partido: "PCdoB",
        foto: "",
        biografia: "",
        cor: "bg-slate-500"
    },
    {
        cargo: "3º SECRETÁRIO",
        parlamentar: "Ver. Ivo Neto",
        partido: "PATRIOTA",
        foto: "",
        biografia: "",
        cor: "bg-slate-500"
    },
    {
        cargo: "CORREGEDOR",
        parlamentar: "Ver. Rosivaldo Cordovil",
        partido: "PSDB",
        foto: "",
        biografia: "",
        cor: "bg-indigo-600"
    },
    {
        cargo: "OUVIDOR",
        parlamentar: "Ver. Cap. Carpê",
        partido: "REPUBLICANOS",
        foto: "",
        biografia: "",
        cor: "bg-purple-600"
    }
];

export default function MesaDiretoraDashboard() {
    return (
        <div className="p-6 space-y-8 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                        <Award className="h-10 w-10 text-blue-800" />
                        Mesa Diretora
                    </h1>
                    <p className="text-slate-500 font-medium">Composição Atual (Biênio 2023-2024)</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 font-bold text-slate-600 gap-2">
                        <History className="h-5 w-5" /> Histórico
                    </Button>
                    <Button className="bg-blue-800 hover:bg-blue-900 text-white font-bold h-14 px-8 rounded-2xl gap-3 shadow-xl shadow-blue-200">
                        <Plus className="h-6 w-6" />
                        Nova Eleição
                    </Button>
                </div>
            </div>

            {/* Composição Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mesaMembers.map((membro, index) => (
                    <Card key={index} className="rounded-3xl border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                        <div className={`h-2 w-full ${membro.cor}`}></div>
                        <CardHeader className="text-center pb-2">
                            <Badge className={`w-fit mx-auto mb-2 ${membro.cor} hover:${membro.cor}`}>
                                {membro.cargo}
                            </Badge>
                            <div className="flex justify-center py-4">
                                <Avatar className="h-32 w-32 border-4 border-white shadow-lg group-hover:scale-105 transition-transform">
                                    <AvatarImage src={membro.foto} alt={membro.parlamentar} />
                                    <AvatarFallback className="text-2xl font-black text-slate-300 bg-slate-50">
                                        {membro.parlamentar.split(' ').slice(-1)[0][0]}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <CardTitle className="text-xl font-black text-slate-900 uppercase">
                                {membro.parlamentar}
                            </CardTitle>
                            <p className="text-sm font-bold text-slate-400">{membro.partido}</p>
                        </CardHeader>
                        <CardContent className="text-center">
                            {membro.biografia && <p className="text-xs text-slate-500 italic px-4">{membro.biografia}</p>}
                        </CardContent>
                        <CardFooter className="justify-center pb-6">
                            <Button variant="ghost" size="sm" className="text-blue-600 font-bold hover:bg-blue-50">
                                Ver Perfil
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
