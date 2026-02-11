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
import { Button } from "@/components/ui/button";
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
}: GenericModalProps) {
    const handleOpenChange = (open: boolean) => {
        onOpenChange?.(open);
        if (!open && onClose) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            {trigger && (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            )}
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle className="uppercase font-bold text-primary">{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto pr-2">
                    {children}
                </div>
                {footer && (
                    <DialogFooter>
                        {footer}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
