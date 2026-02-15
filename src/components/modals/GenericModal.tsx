"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GenericModalProps {
    title: string;
    description?: string;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onClose?: () => void;
    trigger?: ReactNode;
    children?: ReactNode;
    footer?: ReactNode;
    className?: string;
    headerColor?: string;
    size?: "default" | "xl" | "full";
}

export function GenericModal({
    title,
    description,
    isOpen,
    onOpenChange,
    onClose,
    trigger,
    children,
    footer,
    className,
    headerColor = "var(--color-primary)",
    size = "default",
}: GenericModalProps) {
    const handleOpenChange = (open: boolean) => {
        onOpenChange?.(open);
        if (!open && onClose) {
            onClose();
        }
    };

    const sizeClasses = {
        default: "max-w-md",
        xl: "max-w-6xl w-[90vw]",
        full: "max-w-[98vw] w-[98vw] h-[95vh]",
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            {trigger && (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            )}
            <DialogContent className={cn(
                "rounded-none p-0 overflow-hidden border-none",
                sizeClasses[size],
                className
            )}>
                <DialogHeader className="p-4 text-white" style={{ backgroundColor: headerColor }}>
                    <DialogTitle className="uppercase font-bold text-base tracking-wider">{title}</DialogTitle>
                    {description && <DialogDescription className="text-white/80 text-xs italic">{description}</DialogDescription>}
                </DialogHeader>
                <div className={cn(
                    "grid gap-4 p-6 overflow-y-auto pr-4 scrollbar-thin",
                    size === "full" ? "h-full" : "max-h-[80vh]"
                )}>
                    {children}
                </div>
                {footer && (
                    <DialogFooter className="p-4 border-t bg-slate-50">
                        {footer}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
