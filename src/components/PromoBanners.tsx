"use client";
import React from "react";
import Image from "next/image";

export default function PromoBanners() {
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">

                {/* PROMO 1: SPORT BOOK */}
                <a href="#" className="relative block w-full rounded-[var(--radius)] overflow-hidden group">
                    <div className="w-full aspect-[21/9] sm:aspect-[24/9] md:aspect-[16/7] relative">
                        {/* Placeholder gradient for banner 1, later replace with image */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 group-hover:scale-105 transition-transform duration-500"></div>
                        <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-center">
                            <h3 className="text-white text-2xl sm:text-3xl font-black italic tracking-tighter uppercase drop-shadow-md">
                                SPORT<br />BOOK
                            </h3>
                            <div className="mt-3 flex items-center">
                                <span className="text-[var(--primary)] text-sm font-bold uppercase tracking-wider bg-black/50 px-3 py-1 rounded inline-block backdrop-blur-sm border border-[var(--primary)]/30">
                                    Bet Now ➔
                                </span>
                            </div>
                        </div>
                    </div>
                </a>

                {/* PROMO 2: IN-PLAY */}
                <a href="/?sport=3" className="relative block w-full rounded-[var(--radius)] overflow-hidden group">
                    <div className="w-full aspect-[21/9] sm:aspect-[24/9] md:aspect-[16/7] relative">
                        {/* Placeholder gradient for banner 2 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-900 via-emerald-950 to-teal-900 group-hover:scale-105 transition-transform duration-500"></div>
                        <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-center items-end text-right">
                            <h3 className="text-white text-2xl sm:text-3xl font-black italic tracking-tighter uppercase drop-shadow-md">
                                IN-PLAY
                            </h3>
                            <h4 className="text-green-300 font-bold uppercase text-sm mt-1">Live Action</h4>
                            <div className="mt-3 flex items-center justify-end">
                                <span className="text-black text-sm font-bold uppercase tracking-wider bg-[var(--primary)] px-3 py-1 rounded inline-block shadow-lg">
                                    Play Now ➔
                                </span>
                            </div>
                        </div>
                    </div>
                </a>

            </div>
        </div>
    );
}
