import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AppState {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAppStore = create<AppState>()(
    devtools(
        persist(
            (set) => ({
                user: null,
                isAuthenticated: false,
                setUser: (user) => set({ user }),
                setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
            }),
            {
                name: 'itfact-legis-storage',
            }
        )
    )
);
