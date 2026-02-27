"use client";

import { useState, useEffect } from "react";

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

    useEffect(() => {
        let eventSource: EventSource | null = null;
        setLoading(true);

        const connectStream = () => {
            const streamUrl = sportId ? `/api/stream?sportId=${sportId}` : `/api/stream`;
            eventSource = new EventSource(streamUrl);

            eventSource.onmessage = (event) => {
                try {
                    const parsedData = JSON.parse(event.data);

                    const colors = [
                        "from-blue-600 to-indigo-900",
                        "from-pink-600 to-purple-900",
                        "from-red-600 to-orange-900",
                        "from-yellow-600 to-amber-900",
                        "from-green-600 to-emerald-900",
                        "from-cyan-600 to-blue-900",
                    ];

                    const mappedGames: Game[] = parsedData.map((item: any, index: number) => ({
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
                    setLoading(false);
                    setError(null);
                } catch (err) {
                    console.error("[useGames] SSE Parse Error:", err);
                }
            };

            eventSource.onerror = () => {
                console.error("[useGames] SSE disconnected, retrying...");
                eventSource?.close();
                setTimeout(connectStream, 5000); // Reconnect logic
            };
        };

        connectStream();

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [sportId]);

    return { games, loading, error, refresh: () => { } }; // refresh not needed for SSE
};
