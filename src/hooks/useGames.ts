"use client";

import { useState, useEffect } from "react";

export interface Game {
    id: number;
    name: string;
    type: string;
    provider: string;
    color: string;
    odds?: { name: string; value: string }[];
}

export const useGames = (sportId?: number) => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dev.chanderhat.com';
                const url = sportId ? `${apiUrl}/games/live?sportId=${sportId}` : `${apiUrl}/games/live`;

                console.log(`[useGames] Fetching from: ${url}`);

                const response = await fetch(url).catch(err => {
                    throw new Error(`Connection failed: ${err.message}`);
                });

                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}`);
                }

                const data = await response.json();
                console.log("[useGames] Received data:", !!data, "Results count:", data?.results?.length);

                if (data && Array.isArray(data.results) && data.results.length > 0) {
                    const mappedGames = data.results.map((item: any, index: number) => ({
                        id: item.id || `game-${index}`,
                        name: item.home && item.away ? `${item.home} vs ${item.away}` : (item.name || "Live Match"),
                        type: item.league || "Live",
                        provider: "BETSAPI",
                        color: ["from-blue-600 to-indigo-900", "from-pink-600 to-purple-900", "from-accent-red to-orange-900", "from-yellow-600 to-amber-900"][index % 4],
                        odds: item.odds
                    }));
                    setGames(mappedGames);
                    return;
                } else if (data && data.debug && Array.isArray(data.debug) && data.debug.length > 0) {
                    setError(`API Diagnostic: ${data.debug.join(' | ')}`);
                } else if (data && data.error) {
                    setError(`API Error: ${data.error}`);
                } else {
                    setError("No live games currently returned by API.");
                }

            } catch (err: any) {
                console.error("[useGames] Fatal error:", err);
                setError(err.message);
                setGames([]);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [sportId]);

    return { games, loading, error };
};
