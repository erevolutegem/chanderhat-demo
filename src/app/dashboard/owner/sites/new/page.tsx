"use client";

import React from "react";
import { Globe, Plus, X, ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NewSiteWizard = () => {
    const router = useRouter();
    const [step, setStep] = React.useState(1);

    return (
        <div className="max-w-5xl mx-auto space-y-10 md:space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            {/* Header with Back Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 hover:text-white transition-all active:scale-95 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-2xl md:text-5xl lg:text-6xl font-black uppercase italic leading-tight tracking-tighter text-gradient">
                            Deploy <span className="text-white">Whitelabel</span>
                        </h2>
                        <p className="text-[9px] md:text-xs font-black uppercase tracking-[0.3em] text-white/30 mt-2 pl-1 border-l-2 border-accent-yellow/30">
                            Initialize new node in the matrix
                        </p>
                    </div>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-4 px-6 py-3 bg-white/[0.02] border border-white/5 rounded-full">
                    <StepDot active={step >= 1} number={1} label="Configuration" />
                    <ChevronRight className="w-4 h-4 text-white/10" />
                    <StepDot active={step >= 2} number={2} label="Assets" />
                    <ChevronRight className="w-4 h-4 text-white/10" />
                    <StepDot active={step >= 3} number={3} label="Deployment" />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="glass-card rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 relative overflow-hidden group">
                <div className="absolute -right-32 -top-32 w-96 h-96 bg-accent-yellow/5 rounded-full blur-[120px] group-hover:bg-accent-yellow/10 transition-all duration-1000" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 relative z-10">
                    {/* Form Section */}
                    <div className="space-y-10 md:space-y-12">
                        <div className="space-y-8">
                            <WizardInput label="Domain Namespace" placeholder="e.g. baji-live.net" />
                            <WizardInput label="Operational Title" placeholder="e.g. Baji Live" />

                            <div className="space-y-4">
                                <label className="text-[10px] md:text-xs font-black uppercase text-white/30 tracking-[0.2em] pl-1">Configuration Template</label>
                                <div className="relative group">
                                    <select className="w-full bg-white/[0.03] border border-white/5 outline-none rounded-2xl md:rounded-[2rem] py-5 md:py-7 px-8 md:px-10 text-xs md:text-sm font-black text-white focus:border-accent-yellow/40 transition-all appearance-none cursor-pointer tracking-wider">
                                        <option className="bg-secondary-dark">Modern Playbaji (v2)</option>
                                        <option className="bg-secondary-dark">Midnight Sports</option>
                                        <option className="bg-secondary-dark">Classic Premium</option>
                                    </select>
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-hover:text-accent-yellow transition-colors">
                                        <Plus className="w-5 h-5 rotate-45" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Config Placeholder */}
                        <div className="p-6 md:p-8 bg-white/[0.02] rounded-3xl border border-white/5 flex items-start gap-5">
                            <div className="w-10 h-10 rounded-full bg-accent-yellow/10 flex items-center justify-center shrink-0">
                                <Globe className="w-5 h-5 text-accent-yellow" />
                            </div>
                            <div>
                                <h4 className="text-white font-black text-xs md:text-sm uppercase italic mb-1">Advanced DNS Routing</h4>
                                <p className="text-[10px] md:text-xs text-white/30 leading-relaxed font-bold uppercase tracking-widest">Automatic SSL provisioning and Cloudflare edge optimization will be applied to this domain.</p>
                            </div>
                        </div>
                    </div>

                    {/* Asset Upload Section */}
                    <div className="flex flex-col">
                        <label className="text-[10px] md:text-xs font-black uppercase text-white/30 tracking-[0.2em] pl-1 mb-4">Identity Assets</label>
                        <div className="flex-1 min-h-[300px] bg-white/[0.01] rounded-[2.5rem] md:rounded-[3.5rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center p-10 group/drop hover:border-accent-yellow/40 transition-all cursor-pointer shadow-inner relative overflow-hidden">
                            <div className="absolute inset-0 bg-accent-yellow/5 opacity-0 group-hover/drop:opacity-100 transition-opacity duration-1000" />

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover/drop:scale-110 group-hover/drop:bg-accent-yellow/10 transition-all duration-500 shadow-2xl border border-white/5">
                                    <Globe className="w-10 h-10 md:w-12 md:h-12 text-white/20 group-hover/drop:text-accent-yellow transition-colors" />
                                </div>
                                <p className="text-xs md:text-sm font-black uppercase text-white/40 group-hover/drop:text-white transition-colors leading-relaxed tracking-[0.3em]">
                                    Upload Brand Logo<br />
                                    <span className="text-[9px] md:text-[10px] font-black text-white/10 block mt-3 opacity-50 tracking-widest">PNG / SVG / WEBP (MAX 2MB)</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="mt-16 md:mt-24 pt-10 md:pt-16 border-t border-white/5 flex flex-col sm:flex-row gap-6">
                    <button
                        onClick={() => router.back()}
                        className="flex-1 py-6 md:py-8 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-[2rem] md:rounded-[2.5rem] font-black text-xs md:text-sm uppercase tracking-[0.3em] transition-all active:scale-95 border border-white/5"
                    >
                        Cancel Operation
                    </button>
                    <button className="flex-[2] py-6 md:py-8 bg-accent-yellow hover:bg-yellow-500 text-primary-dark rounded-[2rem] md:rounded-[2.5rem] font-black text-xs md:text-sm uppercase tracking-[0.3em] transition-all shadow-[0_20px_60px_-15px_rgba(250,204,21,0.5)] active:scale-95 flex items-center justify-center gap-4 group">
                        Initiate Deployment <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const StepDot = ({ active, number, label }: { active: boolean; number: number; label: string }) => (
    <div className={cn(
        "flex items-center gap-3 transition-opacity duration-500",
        active ? "opacity-100" : "opacity-30"
    )}>
        <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black",
            active ? "bg-accent-yellow text-primary-dark" : "bg-white/10 text-white"
        )}>
            {number}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-white hidden sm:block">{label}</span>
    </div>
);

const WizardInput = ({ label, placeholder }: any) => (
    <div className="space-y-4">
        <label className="text-[10px] md:text-xs font-black uppercase text-white/30 tracking-[0.2em] pl-1">{label}</label>
        <input
            type="text"
            placeholder={placeholder}
            className="w-full bg-white/[0.03] border border-white/5 outline-none rounded-2xl md:rounded-[2rem] py-5 md:py-7 px-8 md:px-10 text-xs md:text-sm font-black text-white transition-all focus:border-accent-yellow/40 tracking-wider placeholder:text-white/5 shadow-inner"
        />
    </div>
);

export default NewSiteWizard;
