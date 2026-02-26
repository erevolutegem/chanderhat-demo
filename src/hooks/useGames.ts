"use client";

import { useState, useEffect, useCallback } from "react";

export interface Game {
    id: string;
    name: string;
    type: string;
    provider: string;
    sport_id: string | null;
    ss: string;
    timer: string;
    color: string;
    odds?: { name: string; value: string }[];
}

export const useGames = (sportId?: number) => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGames = useCallback(async (isInitial = false) => {
        if (isInitial) setLoading(true);
        setError(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dev.chanderhat.com';
            const url = sportId ? `${apiUrl}/games/live?sportId=${sportId}` : `${apiUrl}/games/live`;

            console.log(`[useGames] Fetching: ${url}`);

            const response = await fetch(url, { cache: 'no-store' });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`[useGames] Received ${data?.count ?? 0} games. success=${data?.success}`);

            if (data && Array.isArray(data.results) && data.results.length > 0) {
                const colors = [
                    "from-blue-600 to-indigo-900",
                    "from-pink-600 to-purple-900",
                    "from-red-600 to-orange-900",
                    "from-yellow-600 to-amber-900",
                    "from-green-600 to-emerald-900",
                    "from-cyan-600 to-blue-900",
                ];

                const mappedGames: Game[] = data.results.map((item: any, index: number) => ({
                    id: String(item.id || item.FI || `game-${index}`),
                    name: item.home && item.away
                        ? `${item.home} vs ${item.away}`
                        : (item.name || "Live Match"),
                    type: item.league || "Live",
                    provider: "BETSAPI",
                    sport_id: item.sport_id ? String(item.sport_id) : null,
                    ss: item.ss || "0-0",
                    timer: item.timer || "0",
                    color: colors[index % colors.length],
                    odds: Array.isArray(item.odds) ? item.odds : [],
                }));

                setGames(mappedGames);
            } else {
                // Don't clear existing games on empty refresh — only set empty on initial load
                if (isInitial) setGames([]);
                if (data?.error) setError(`API: ${data.error}`);
                else if (!data?.results?.length) setError("No live games available right now");
            }
        } catch (err: any) {
            console.error("[useGames] Error:", err.message);
            if (isInitial) setGames([]);
            setError(err.message);
        } finally {
            if (isInitial) setLoading(false);
        }
    }, [sportId]);

    useEffect(() => {
        fetchGames(true);

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => fetchGames(false), 30000);
        return () => clearInterval(interval);
    }, [fetchGames]);

    return { games, loading, error, refresh: () => fetchGames(false) };
};
