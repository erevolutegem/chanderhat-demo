"use client";
import { useState, useEffect, useRef, useCallback } from "react";

export interface Match {
    id: string;
    sport_id: string;
    league: string;
    home: string;
    away: string;
    ss: string | null;
    timer: string | null;
    odds: { name: string; value: string }[];
}

interface State {
    matches: Match[];
    connected: boolean;
    error: string | null;
    lastUpdate: Date | null;
}

/**
 * useRealtimeMatches — connects to /api/games/stream via SSE.
 * Data flows in real-time whenever BetsAPI reports a score/odds change
 * (checked every 3 seconds server-side, pushed only on diff).
 */
export function useRealtimeMatches(sportId?: number) {
    const [state, setState] = useState<State>({
        matches: [],
        connected: false,
        error: null,
        lastUpdate: null,
    });

    const esRef = useRef<EventSource | null>(null);
    const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const retries = useRef(0);

    const connect = useCallback(() => {
        // Close existing
        esRef.current?.close();

        const url = `/api/games/stream${sportId ? `?sportId=${sportId}` : ""}`;
        const es = new EventSource(url);
        esRef.current = es;

        es.onopen = () => {
            setState(s => ({ ...s, connected: true, error: null }));
            retries.current = 0;
        };

        es.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data);
                if (msg.type === "matches") {
                    setState(s => ({
                        ...s,
                        matches: msg.data ?? [],
                        lastUpdate: new Date(),
                    }));
                }
            } catch { }
        };

        es.onerror = () => {
            setState(s => ({ ...s, connected: false, error: "Connection lost" }));
            es.close();

            // Exponential backoff reconnect: 1s, 2s, 4s, 8s … max 30s
            const delay = Math.min(1000 * Math.pow(2, retries.current), 30_000);
            retries.current++;
            retryRef.current = setTimeout(connect, delay);
        };
    }, [sportId]);

    useEffect(() => {
        connect();
        return () => {
            esRef.current?.close();
            if (retryRef.current) clearTimeout(retryRef.current);
        };
    }, [connect]);

    const reconnect = useCallback(() => {
        retries.current = 0;
        connect();
    }, [connect]);

    return { ...state, reconnect };
}
