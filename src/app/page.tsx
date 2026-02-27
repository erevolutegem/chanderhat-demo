"use client";

import React, { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import MatchList from "@/components/MatchList";
import BetSlip from "@/components/BetSlip";
import HeroSection from "@/components/HeroSection";
import MobileBottomNav from "@/components/MobileBottomNav";
import AuthModal from "@/components/AuthModal";

const SPORT_TABS = [
  { id: undefined, icon: "⚡", label: "All" },
  { id: 3, icon: "🏏", label: "Cricket" },
  { id: 1, icon: "⚽", label: "Soccer" },
  { id: 13, icon: "🎾", label: "Tennis" },
  { id: 18, icon: "🏀", label: "Basketball" },
  { id: 12, icon: "🏈", label: "Football" },
  { id: 4, icon: "🏒", label: "Hockey" },
];

export default function Home() {
  const [selectedSport, setSelectedSport] = useState<number | undefined>(undefined);
  const [matchCounts, setMatchCounts] = useState<Record<string, number>>({});
  const [authOpen, setAuthOpen] = useState(false);

  const handleCountChange = useCallback((counts: Record<string, number>) => {
    setMatchCounts(counts);
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col pb-16 lg:pb-0" style={{ background: "#1a1a2e" }}>
        <Navbar onLoginClick={() => setAuthOpen(true)} />
        <HeroSection />

        {/* Mobile Sport Tabs */}
        <div className="lg:hidden flex overflow-x-auto scrollbar-hide px-2 py-2 gap-1.5"
          style={{ background: "#12122a", borderBottom: "1px solid #2a2a4a" }}>
          {SPORT_TABS.map(s => (
            <button key={String(s.id)}
              onClick={() => setSelectedSport(s.id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all"
              style={{
                background: selectedSport === s.id ? "#e02020" : "#1e1e3a",
                color: selectedSport === s.id ? "#fff" : "#6666aa",
                border: selectedSport === s.id ? "1px solid #e02020" : "1px solid #2a2a4a",
              }}>
              <span>{s.icon}</span>
              <span>{s.label}</span>
              {s.id !== undefined && (matchCounts[String(s.id)] ?? 0) > 0 && (
                <span className="text-[10px] font-black px-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.2)" }}>
                  {matchCounts[String(s.id)]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 3-Column Layout */}
        <div className="flex flex-1 max-w-[1400px] mx-auto w-full">
          <LeftSidebar
            selectedSport={selectedSport}
            onSelectSport={setSelectedSport}
            matchCounts={matchCounts}
          />
          <MatchList
            sportId={selectedSport}
            onCountChange={handleCountChange}
          />
          <BetSlip bets={[]} onRemove={() => { }} onStakeChange={() => { }} onClear={() => { }} />
        </div>
      </div>

      <MobileBottomNav
        betCount={0}
        onLoginClick={() => setAuthOpen(true)}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        type="login"
      />
    </>
  );
}
