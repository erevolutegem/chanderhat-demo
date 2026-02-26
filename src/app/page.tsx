"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
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
    <div className="min-h-screen" style={{ background: "#0f1219" }}>
      <Navbar />
      <HeroCarousel />
      <GameMenu onSelectSport={setSelectedSport} selectedSport={selectedSport} />
      <SportsCategoryView sportId={selectedSport} onSelectGame={setSelectedGameId} />
      <Footer />
      <MobileBottomNav />
      <GameDetailModal gameId={selectedGameId} onClose={() => setSelectedGameId(null)} />
    </div>
  );
}
