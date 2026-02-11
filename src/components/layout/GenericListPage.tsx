"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from "lucide-react";

export default function GenericListPage({ title, description, actionLabel, headerAction, children }: { title: string, description: string, actionLabel?: string, headerAction?: React.ReactNode, children?: React.ReactNode }) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight uppercase text-primary">{title}</h1>
                    <p className="text-muted-foreground">{description}</p>
                </div>
                {headerAction ? headerAction : actionLabel && (
                    <Button className="uppercase">
                        <Plus className="mr-2 h-4 w-4" /> {actionLabel}
                    </Button>
                )}
            </div>

            {children ? children : (
                <>
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="uppercase text-sm font-medium text-muted-foreground">Filtros e Pesquisa</CardTitle>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="PESQUISAR..." className="pl-9" />
                                </div>
                                <Button variant="outline" className="uppercase">Filtrar</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-0">
                            <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px] text-muted-foreground space-y-4">
                                <div className="bg-muted p-4 rounded-full">
                                    <Search className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="font-medium">Nenhum registro encontrado</p>
                                    <p className="text-sm">Utilize os filtros acima ou cadastre um novo item.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
