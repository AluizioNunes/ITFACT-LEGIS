"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Mock schema
const loginSchema = z.object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    // const { toast } = useToast(); // If toast is setup
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            console.log("Login data:", data);

            // Navigate to dashboard
            router.push("/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-md space-y-4">
                <div className="flex flex-col items-center space-y-2 text-center mb-8">
                    <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                        <LogIn className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ITFACT LEGIS
                    </h1>
                    <p className="text-muted-foreground">Gestão Legislativa Inteligente</p>
                </div>

                <Card className="border-muted-foreground/20 shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Entrar no sistema</CardTitle>
                        <CardDescription className="text-center">
                            Digite suas credenciais para acessar o painel
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Corporativo</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nome@camara.leg.br"
                                    {...register("email")}
                                    className={errors.email ? "border-red-500" : ""}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Senha</Label>
                                    <Link href="#" className="text-xs text-primary hover:underline">
                                        Esqueceu a senha?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        {...register("password")}
                                        className={errors.password ? "border-red-500" : ""}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" />
                                <label
                                    htmlFor="remember"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                                >
                                    Lembrar-me por 30 dias
                                </label>
                            </div>

                            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Entrando...
                                    </>
                                ) : (
                                    "Acessar Sistema"
                                )}
                            </Button>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Ou continue com
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full border-dashed border-yellow-500/50 hover:bg-yellow-500/10 hover:text-yellow-600 text-yellow-600"
                                onClick={() => router.push("/dashboard")}
                            >
                                🧪 ACESSO DESENVOLVEDOR
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t p-4">
                        <p className="text-xs text-muted-foreground text-center">
                            Protegido por reCAPTCHA e sujeito à Política de Privacidade e Termos de Uso.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
