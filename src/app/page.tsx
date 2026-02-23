import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import GameMenu from "@/components/GameMenu";
import GameGrid from "@/components/GameGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-primary-dark">
      <Navbar />
      <main>
        <HeroCarousel />
        <GameMenu />
        <GameGrid />
      </main>
      <Footer />
    </div>
  );
}
