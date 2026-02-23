"use client";

import { useState, useEffect } from "react";

export interface Game {
    id: number;
    name: string;
    type: string;
    provider: string;
    color: string;
}

export const useGames = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dev.chanderhat.com';
                const response = await fetch(`${apiUrl}/games/live`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();

                if (data && data.results) {
                    // Map BetsAPI results to our UI structure
                    const mappedGames = data.results.slice(0, 12).map((item: any, index: number) => ({
                        id: item.id || index,
                        name: item.home?.name || "Live Match",
                        type: "Live",
                        provider: "BETSAPI",
                        color: ["from-blue-600 to-indigo-900", "from-pink-600 to-purple-900", "from-accent-red to-orange-900", "from-yellow-600 to-amber-900"][index % 4]
                    }));
                    setGames(mappedGames);
                }
            } catch (error) {
                console.error("Failed to fetch games:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    return { games, loading };
};
