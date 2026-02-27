import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlayBaji — Live Sports Betting",
  description: "Real-time sportsbook with live odds on Cricket, Soccer, Tennis, Basketball and more.",
  keywords: "sports betting, live odds, cricket, soccer, tennis, bet365",
  openGraph: {
    title: "PlayBaji — Live Sports Betting",
    description: "Real-time live odds on all major sports.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
