"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

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
        setLoading(true);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

        // Connect to the /live namespace matching EventsGateway
        const socket: Socket = io(apiUrl + "/live", {
            transports: ["websocket", "polling"],
        });

        socket.on("connect", () => {
            console.log("[useGames] Socket connected");
            if (sportId) {
                socket.emit("subscribe:sport", { sportId });
            }
        });

        // Listen for the specific event type
        const eventName = sportId ? "live:update" : "live:update:all";

        socket.on(eventName, (data: any) => {
            try {
                // Backend sends { timestamp: string, matches: any[] }
                const rawMatches = data.matches || [];

                const colors = [
                    "from-blue-600 to-indigo-900",
                    "from-pink-600 to-purple-900",
                    "from-red-600 to-orange-900",
                    "from-yellow-600 to-amber-900",
                    "from-green-600 to-emerald-900",
                    "from-cyan-600 to-blue-900",
                ];

                const mappedGames: Game[] = rawMatches.map((item: any, index: number) => ({
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
                console.error("[useGames] Socket Parse Error:", err);
            }
        });

        socket.on("connect_error", (err) => {
            console.error("[useGames] Socket Error:", err.message);
            // Don't set error state continuously to avoid UI flashing, reconnect will handle it
        });

        return () => {
            socket.disconnect();
        };
    }, [sportId]);

    return { games, loading, error, refresh: () => { } }; // refresh not needed for WebSockets
};
