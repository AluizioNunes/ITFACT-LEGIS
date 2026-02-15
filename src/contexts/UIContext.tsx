"use client";

import React, { createContext, useContext, useState } from "react";

interface UIContextType {
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);
    const setSidebarCollapsed = (collapsed: boolean) => setIsSidebarCollapsed(collapsed);

    return (
        <UIContext.Provider value={{
            isSidebarCollapsed,
            toggleSidebar,
            setSidebarCollapsed,
            isMobileOpen,
            setIsMobileOpen
        }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error("useUI must be used within a UIProvider");
    }
    return context;
}
