"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UIContextType {
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

    const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);
    const setSidebarCollapsed = (collapsed: boolean) => setIsSidebarCollapsed(collapsed);

    return (
        <UIContext.Provider value={{ isSidebarCollapsed, toggleSidebar, setSidebarCollapsed }}>
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
