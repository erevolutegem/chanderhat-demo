"use client";
import React, { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import MatchList from "@/components/MatchList";
import BetSlip from "@/components/BetSlip";
import HeroSection from "@/components/HeroSection";
import PromoBanners from "@/components/PromoBanners";
import CasinoGrid from "@/components/CasinoGrid";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import AuthModal from "@/components/AuthModal";

// Mock data for Playbaji Clone Casino Grid
// Using Unsplash casino/entertainment/abstract imagery to mimic realistic game covers
const LIVE_CASINO_GAMES = [
  { id: "c1", name: "Mono Poly", image: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=300&fit=crop" },
  { id: "c2", name: "Mega Roulette", image: "https://images.unsplash.com/photo-1606167668511-22c66141a0e1?w=400&h=300&fit=crop" },
  { id: "c3", name: "Mega Sicbo", image: "https://images.unsplash.com/photo-1517409419131-0bb644d6a19f?w=400&h=300&fit=crop" },
  { id: "c4", name: "Mega Wheel", image: "https://images.unsplash.com/photo-1498837167922-41c30907e54f?w=400&h=300&fit=crop" },
  { id: "c5", name: "Magic Wheel", image: "https://images.unsplash.com/photo-1518542981329-8fbafce028f0?w=400&h=300&fit=crop" },
  { id: "c6", name: "American Roulette", image: "https://images.unsplash.com/photo-1621252179027-94459d278660?w=400&h=300&fit=crop" },
  { id: "c7", name: "European Roulette", image: "https://images.unsplash.com/photo-1563725679468-b7bb5ff493ea?w=400&h=300&fit=crop" },
  { id: "c8", name: "Roll to Luck", image: "https://images.unsplash.com/photo-1605870445919-838d190e8e1b?w=400&h=300&fit=crop" },
];

const SLOT_GAMES = [
  { id: "s1", name: "French Roulette", image: "https://images.unsplash.com/photo-1614050212354-9ee799863863?w=400&h=300&fit=crop" },
  { id: "s2", name: "Jili City", image: "https://images.unsplash.com/photo-1574880018874-82ea08871bd7?w=400&h=300&fit=crop" },
  { id: "s3", name: "Slot Games (Playball)", image: "https://images.unsplash.com/photo-1550296716-eec56184f4f7?w=400&h=300&fit=crop" },
  { id: "s4", name: "Lucky 777", image: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=300&fit=crop" },
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
      <div className="min-h-screen flex flex-col pb-16 lg:pb-0 bg-[var(--bg)]">
        <Navbar onLoginClick={() => setAuthOpen(true)} />

        {/* Playbaji Layout Container */}
        <div className="flex flex-1 max-w-[1440px] w-full mx-auto px-4 mt-4 lg:mt-6 gap-4">

          {/* LEFT SIDEBAR (Hidden on mobile) */}
          <div className="hidden lg:block w-[240px] flex-shrink-0">
            <LeftSidebar
              selectedSport={selectedSport}
              onSelectSport={setSelectedSport}
              matchCounts={matchCounts}
            />
          </div>

          {/* MAIN CENTER CONTENT (Hero -> Matches -> Promos -> Casino) */}
          <main className="flex-1 min-w-0 flex flex-col gap-6">
            <HeroSection />

            {/* LIVE MATCHES */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded overflow-hidden">
              {/* Live Section Header Matching PB */}
              <div className="bg-[var(--surface-3)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-[4px] h-[16px] bg-[var(--primary)] rounded-full"></div>
                  <h2 className="text-white text-[16px] font-black uppercase tracking-tight">Live Highlights</h2>
                </div>
              </div>

              <MatchList
                sportId={selectedSport}
                onCountChange={handleCountChange}
              />
            </div>

            {/* TWO BIG PROMO BANNERS */}
            <PromoBanners />

            {/* CASINO GRIDS (Exact visual clone) */}
            <CasinoGrid title="Live Casino" games={LIVE_CASINO_GAMES} />
            <CasinoGrid title="Slot Games" games={SLOT_GAMES} />

            {/* SPACING AT BOTTOM */}
            <div className="h-8"></div>
          </main>

          {/* RIGHT SIDEBAR (BetSlip) */}
          <div className="hidden xl:block w-[300px] flex-shrink-0">
            <BetSlip bets={[]} onRemove={() => { }} onStakeChange={() => { }} onClear={() => { }} />
          </div>

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
