"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";

interface Option {
    value: string;
    label: string;
}

interface MultiSelectCreatableProps {
    options: Option[];
    selected: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    className?: string;
}

export function MultiSelectCreatable({
    options,
    selected,
    onChange,
    placeholder = "Selecione ou digite um nome...",
    className,
}: MultiSelectCreatableProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = React.useState("");
    const [open, setOpen] = React.useState(false);

    const handleUnselect = React.useCallback((value: string) => {
        onChange(selected.filter((s) => s !== value));
    }, [onChange, selected]);

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;
        if (input) {
            if (e.key === "Delete" || e.key === "Backspace") {
                if (input.value === "" && selected.length > 0) {
                    onChange(selected.slice(0, -1));
                }
            }
            if (e.key === "Escape") {
                input.blur();
            }
            if (e.key === "Enter" && inputValue.trim() !== "") {
                if (!selected.includes(inputValue)) {
                    onChange([...selected, inputValue]);
                    setInputValue("");
                }
            }
        }
    }, [onChange, selected, inputValue]);

    const selectables = options.filter((option) => !selected.includes(option.value));

    return (
        <Command onKeyDown={handleKeyDown} className={cn("overflow-visible bg-transparent", className)}>
            <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-white">
                <div className="flex flex-wrap gap-1">
                    {selected.map((val) => {
                        const opt = options.find((o) => o.value === val);
                        return (
                            <Badge key={val} variant="secondary" className="rounded-sm px-1 font-normal uppercase">
                                {opt?.label || val}
                                <button
                                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleUnselect(val);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={() => handleUnselect(val)}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        );
                    })}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder={placeholder}
                        className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground uppercase"
                    />
                </div>
            </div>
            <div className="relative mt-2">
                {open && selectables.length > 0 && (
                    <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                        <CommandList className="h-full overflow-hidden">
                            <CommandGroup className="h-full overflow-auto">
                                {selectables.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onSelect={() => {
                                            setInputValue("");
                                            onChange([...selected, option.value]);
                                        }}
                                        className={"cursor-pointer uppercase"}
                                    >
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </div>
                )}
            </div>
        </Command>
    );
}
