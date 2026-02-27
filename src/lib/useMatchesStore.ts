/**
 * Zustand store for live match state
 * Handles: current sport, active tab, matches list, loading, error
 * Also manages Socket.io live updates
 */
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

export interface Match {
    id: string;
    sport_id: string;
    league: string;
    home: string;
    away: string;
    name: string;
    ss: string | null;
    timer: string | null;
    time_status: string;
    scheduled_time?: number;
    odds: { name: string; value: string }[];
}

export type TabKey = "inplay" | "today" | "tomorrow";

interface MatchesState {
    // Current selection
    selectedSportId: number | undefined;
    activeTab: TabKey;

    // Data
    matches: Match[];
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;

    // Actions
    setSelectedSport: (id: number | undefined) => void;
    setActiveTab: (tab: TabKey) => void;
    setMatches: (matches: Match[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Live update from Socket.io
    applyLiveUpdate: (update: { sportId: number; matches: Match[] }) => void;

    // Fetch action
    fetchMatches: () => Promise<void>;
}

export const useMatchesStore = create<MatchesState>()(
    devtools(
        subscribeWithSelector((set, get) => ({
            selectedSportId: undefined,
            activeTab: "inplay",
            matches: [],
            loading: true,
            error: null,
            lastUpdated: null,

            setSelectedSport: (id) => {
                set({ selectedSportId: id, activeTab: "inplay", matches: [], loading: true, error: null }, false, "setSelectedSport");
                // Auto-fetch when sport changes
                setTimeout(() => get().fetchMatches(), 0);
            },

            setActiveTab: (tab) => {
                set({ activeTab: tab, matches: [], loading: true, error: null }, false, "setActiveTab");
                setTimeout(() => get().fetchMatches(), 0);
            },

            setMatches: (matches) => set({ matches }, false, "setMatches"),
            setLoading: (loading) => set({ loading }, false, "setLoading"),
            setError: (error) => set({ error }, false, "setError"),

            applyLiveUpdate: ({ sportId, matches }) => {
                const { selectedSportId } = get();
                // Only apply if update is for the currently selected sport
                if (selectedSportId === undefined || selectedSportId === sportId) {
                    set({ matches, lastUpdated: new Date().toISOString() }, false, "liveUpdate");
                }
            },

            fetchMatches: async () => {
                const { selectedSportId, activeTab } = get();
                set({ loading: true, error: null }, false, "fetchStart");

                try {
                    const p = new URLSearchParams();
                    if (activeTab !== "inplay") p.set("tab", activeTab);
                    if (selectedSportId) p.set("sportId", String(selectedSportId));
                    const qs = p.toString();
                    const url = `/api/games${qs ? `?${qs}` : ""}`;

                    const resp = await fetch(url, { cache: "no-store" });
                    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

                    const data = await resp.json();
                    const matches: Match[] = Array.isArray(data?.results) ? data.results : [];

                    set({
                        matches,
                        loading: false,
                        error: null,
                        lastUpdated: new Date().toISOString(),
                    }, false, "fetchSuccess");
                } catch (err: any) {
                    set({ loading: false, error: err.message, matches: [] }, false, "fetchError");
                }
            },
        })),
        { name: "MatchesStore" }
    )
);
