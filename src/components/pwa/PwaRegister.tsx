'use client';

import { useEffect } from 'react';

/**
 * Hook para registrar o Service Worker PWA.
 * Inclua <PwaRegister /> no layout principal.
 */
export function usePwaRegister() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((reg) => {
                    console.log('[PWA] Service Worker registrado:', reg.scope);

                    // Check for updates periodically
                    setInterval(() => reg.update(), 60 * 60 * 1000); // 1h
                })
                .catch((err) => console.error('[PWA] Service Worker falhou:', err));
        }

        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then((perm) => {
                console.log('[PWA] Notificações:', perm);
            });
        }
    }, []);
}

export default function PwaRegister() {
    usePwaRegister();
    return null;
}
