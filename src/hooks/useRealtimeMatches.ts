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
    loading: boolean;
    lastUpdate: Date | null;
}

/**
 * useRealtimeMatches:
 * 1. Immediately loads data via REST /api/games (fast first paint)
 * 2. Starts SSE stream for real-time updates
 * 3. Falls back to REST polling every 5s if SSE fails
 */
export function useRealtimeMatches(sportId?: number) {
    const [state, setState] = useState<State>({
        matches: [], connected: false, loading: true, lastUpdate: null,
    });

    const esRef = useRef<EventSource | null>(null);
    const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const retries = useRef(0);
    const sportRef = useRef(sportId);
    sportRef.current = sportId;

    const apiUrl = useCallback(() => {
        const sp = sportRef.current;
        return `/api/games${sp ? `?sportId=${sp}` : ""}`;
    }, []);

    /* Initial REST load (instant) */
    const restLoad = useCallback(async (setLoading = false) => {
        if (setLoading) setState(s => ({ ...s, loading: true }));
        try {
            const r = await fetch(apiUrl(), { cache: "no-store" });
            const d = await r.json();
            const list: Match[] = Array.isArray(d?.results) ? d.results : [];
            setState(s => ({ ...s, matches: list, loading: false, lastUpdate: new Date() }));
        } catch {
            setState(s => ({ ...s, loading: false }));
        }
    }, [apiUrl]);

    /* SSE connection */
    const connectSSE = useCallback(() => {
        esRef.current?.close();
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }

        const sp = sportRef.current;
        const url = `/api/games/stream${sp ? `?sportId=${sp}` : ""}`;
        const es = new EventSource(url);
        esRef.current = es;

        const connectTimeout = setTimeout(() => {
            // SSE not connected in 5s → fall back to REST polling
            if (!es || es.readyState !== EventSource.OPEN) {
                es.close();
                setState(s => ({ ...s, connected: false }));
                pollRef.current = setInterval(() => restLoad(), 5_000);
            }
        }, 5_000);

        es.onopen = () => {
            clearTimeout(connectTimeout);
            setState(s => ({ ...s, connected: true }));
            if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
            retries.current = 0;
        };

        es.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data);
                if (msg.type === "matches") {
                    setState(s => ({ ...s, matches: msg.data ?? [], loading: false, lastUpdate: new Date() }));
                }
            } catch { }
        };

        es.onerror = () => {
            clearTimeout(connectTimeout);
            setState(s => ({ ...s, connected: false }));
            es.close();

            // Fall back to REST polling
            if (!pollRef.current) {
                pollRef.current = setInterval(() => restLoad(), 5_000);
            }

            // Retry SSE after backoff
            const delay = Math.min(1000 * Math.pow(2, retries.current), 30_000);
            retries.current++;
            retryRef.current = setTimeout(connectSSE, delay);
        };

        return () => { clearTimeout(connectTimeout); };
    }, [restLoad]);

    useEffect(() => {
        // Immediately load via REST
        restLoad(true);
        // Then start SSE
        const cleanup = connectSSE();
        return () => {
            cleanup?.();
            esRef.current?.close();
            if (retryRef.current) clearTimeout(retryRef.current);
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [sportId]); // Re-run when sport changes

    const reconnect = useCallback(() => {
        retries.current = 0;
        restLoad(true);
        connectSSE();
    }, [restLoad, connectSSE]);

    return { ...state, reconnect };
}
