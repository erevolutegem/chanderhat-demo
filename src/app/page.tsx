"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import GameMenu from "@/components/GameMenu";
import GameGrid from "@/components/GameGrid";
import Footer from "@/components/Footer";

export default function Home() {
  const [selectedSport, setSelectedSport] = useState<number | undefined>(undefined);

  return (
    <div className="min-h-screen bg-primary-dark relative">
      <div className="fixed top-0 left-0 z-[9999] bg-accent-yellow text-primary-dark text-xs font-black px-4 py-1 shadow-2xl tracking-tighter italic">REAL_API_ONLY_v7.0.0</div>
      <Navbar />
      <main>
        <HeroCarousel />
        <GameMenu onSelectSport={setSelectedSport} selectedSport={selectedSport} />
        <GameGrid sportId={selectedSport} />
      </main>
      <Footer />
    </div>
  );
}
