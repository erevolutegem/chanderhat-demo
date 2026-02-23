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
                    const mappedGames = data.results.slice(0, 16).map((item: any, index: number) => ({
                        id: item.id || `game-${index}`,
                        name: item.home?.name ? `${item.home.name} vs ${item.away?.name || '??'}` : "Live Match",
                        type: item.sport_id === "3" ? "Cricket" : item.sport_id === "1" ? "Soccer" : "Live",
                        provider: "BETSAPI",
                        color: ["from-blue-600 to-indigo-900", "from-pink-600 to-purple-900", "from-accent-red to-orange-900", "from-yellow-600 to-amber-900"][index % 4],
                        odds: item.odds
                    }));
                    setGames(mappedGames);
                    return;
                } else if (data && data.error) {
                    setError(`API Error: ${data.error}`);
                } else {
                    setError("No live games currently returned by API.");
                }

            } catch (err: any) {
                console.error("[useGames] Fatal error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }

            // If we reached here without returning, use fallback
            console.warn("[useGames] Showing fallback games.");
            const fallbackGames = [
                { id: 201, name: "Manchester City vs Real Madrid", type: "Soccer", provider: "BETSAPI", color: "from-blue-600 to-indigo-900", odds: [{ name: "1", value: "2.10" }, { name: "X", value: "3.40" }, { name: "2", value: "3.20" }] },
                { id: 202, name: "India vs Pakistan (T20)", type: "Cricket", provider: "BETSAPI", color: "from-blue-600 to-sky-900", odds: [{ name: "1", value: "1.80" }, { name: "2", value: "2.00" }] },
                { id: 203, name: "Novak Djokovic vs Rafael Nadal", type: "Tennis", provider: "BETSAPI", color: "from-pink-600 to-purple-900", odds: [{ name: "1", value: "1.40" }, { name: "2", value: "2.80" }] },
            ];
            setGames(fallbackGames);
        };

        fetchGames();
    }, [sportId]);

    return { games, loading, error };
};
