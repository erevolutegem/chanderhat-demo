"use client";

import { useEffect, useState } from 'react';

export const useBackendStatus = () => {
    const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dev.chanderhat.com';
                const response = await fetch(`${apiUrl}/games/live`, { method: 'HEAD' });
                // We check /games/live specifically since that's what we need
                if (response.ok || response.status === 404 || response.status === 405) {
                    setStatus('online');
                } else {
                    setStatus('offline');
                }
            } catch (error) {
                setStatus('offline');
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    return status;
};
