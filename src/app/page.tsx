"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import HeroCarousel from "@/components/HeroCarousel";
import GameMenu from "@/components/GameMenu";
import SportsCategoryView from "@/components/SportsCategoryView";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import GameDetailModal from "@/components/GameDetailModal";

export default function Home() {
  const [selectedSport, setSelectedSport] = useState<number | undefined>(undefined);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-primary-dark relative pb-16 lg:pb-0">
      <Navbar />

      <div className="max-w-7xl mx-auto flex">
        <SideNav onSelectSport={setSelectedSport} selectedSport={selectedSport} />
        <main className="flex-1 overflow-hidden">
          <HeroCarousel />
          <GameMenu onSelectSport={setSelectedSport} selectedSport={selectedSport} />
          <SportsCategoryView sportId={selectedSport} onSelectGame={setSelectedGameId} />
        </main>
      </div>

      <GameDetailModal gameId={selectedGameId} onClose={() => setSelectedGameId(null)} />

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
