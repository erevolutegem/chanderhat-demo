"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import MatchList from "@/components/MatchList";
import BetSlip from "@/components/BetSlip";
import HeroSection from "@/components/HeroSection";
import CasinoGrid from "@/components/CasinoGrid";
import Footer from "@/components/Footer";
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

  const totalLive = Object.values(matchCounts).reduce((a, b) => a + b, 0);

  return (
    <>
      <div className="min-h-screen flex flex-col pb-16 lg:pb-0" style={{ background: "#0f0e17" }}>
        <Navbar onLoginClick={() => setAuthOpen(true)} />
        <HeroSection />

        {/* ── Live Stats Ticker ── */}
        <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto scrollbar-hide"
          style={{ background: "#0d0c1a", borderBottom: "1px solid #2d2c45" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            <span className="live-dot" />
            <span style={{ fontSize: 11, fontWeight: 800, color: "#e8173a", letterSpacing: 1.2, textTransform: "uppercase" }}>Live Now</span>
          </div>
          <div style={{ width: 1, height: 14, background: "#2d2c45", flexShrink: 0 }} />
          {[
            { icon: "🏏", id: 3, label: "Cricket", color: "#22c55e" },
            { icon: "⚽", id: 1, label: "Soccer", color: "#3b82f6" },
            { icon: "🎾", id: 13, label: "Tennis", color: "#f59e0b" },
            { icon: "🏀", id: 18, label: "Basketball", color: "#f97316" },
          ].map(s => {
            const cnt = matchCounts[String(s.id)] ?? 0;
            const active = selectedSport === s.id;
            return (
              <button key={s.id} onClick={() => setSelectedSport(s.id)}
                className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all"
                style={{
                  background: active ? `${s.color}22` : "#1a192a", color: active ? s.color : "#9997b8",
                  border: `1px solid ${active ? s.color + "55" : "#2d2c45"}`
                }}>
                {s.icon} {s.label}
                {cnt > 0 && (
                  <span style={{ fontSize: 10, fontWeight: 800, padding: "1px 5px", borderRadius: 99, background: active ? s.color : "#2d2c45", color: "#fff" }}>
                    {cnt}
                  </span>
                )}
              </button>
            );
          })}
          {totalLive > 0 && (
            <span className="ml-auto flex-shrink-0 text-[11px]" style={{ color: "#5e5c7a" }}>
              {totalLive} matches live
            </span>
          )}
        </div>

        {/* Mobile Sport Tabs */}
        <div className="lg:hidden flex overflow-x-auto scrollbar-hide px-2 py-2 gap-1.5"
          style={{ background: "#131220", borderBottom: "1px solid #2d2c45" }}>
          {SPORT_TABS.map(s => {
            const active = selectedSport === s.id;
            return (
              <button key={String(s.id)} onClick={() => setSelectedSport(s.id)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all"
                style={{
                  background: active ? "#e8173a" : "#1a192a", color: active ? "#fff" : "#6664a8",
                  border: active ? "1px solid #e8173a" : "1px solid #2d2c45"
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
            );
          })}
        </div>

        {/* 3-Column Main Layout */}
        <div className="flex flex-1 max-w-[1400px] w-full mx-auto">
          <LeftSidebar
            selectedSport={selectedSport}
            onSelectSport={setSelectedSport}
            matchCounts={matchCounts}
          />
          <main className="flex-1 min-w-0">
            <MatchList
              sportId={selectedSport}
              onCountChange={handleCountChange}
            />
            {/* Casino section below live matches */}
            <div className="border-t" style={{ borderColor: "#2a2a4a" }}>
              <CasinoGrid />
            </div>
          </main>
          <BetSlip bets={[]} onRemove={() => { }} onStakeChange={() => { }} onClear={() => { }} />
        </div>

        <Footer />
      </div>

      <MobileBottomNav
        betCount={0}
        onLoginClick={() => setAuthOpen(true)}
      />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} type="login" />
    </>
  );
}
