"use client";

import React, { useState } from "react";
import { Layout, Plus, Edit, Trash2, Globe, Eye, Layers, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

const TemplateManager = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [templates, setTemplates] = useState([
        { id: 1, name: "Modern Playbaji", key: "playbaji", usage: 12, status: "Active", color: "#ffc107" },
        { id: 2, name: "Midnight Premium", key: "midnight", usage: 5, status: "Active", color: "#1a2a6c" },
        { id: 3, name: "Classic Sports", key: "classic", usage: 8, status: "Legacy", color: "#2d3436" },
    ]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-xl md:text-3xl font-black uppercase italic text-white leading-tight">Design <span className="text-accent-yellow text-2xl md:text-4xl">Templates</span></h2>
                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-1.5">Manage visual themes and whitelabel skins</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-accent-yellow hover:bg-yellow-500 text-primary-dark rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all shadow-xl shadow-accent-yellow/10"
                >
                    <Plus className="w-5 h-5" /> Add New Template
                </button>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {templates.map((template) => (
                    <div key={template.id} className="bg-secondary-dark/50 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-accent-yellow/20 transition-all flex flex-col">
                        {/* Preview Area */}
                        <div className="h-32 md:h-40 bg-white/5 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundColor: template.color }} />
                            <Layout className="w-12 h-12 md:w-16 md:h-16 text-white/10 group-hover:scale-110 group-hover:text-accent-yellow/20 transition-all duration-500" />
                            <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 flex gap-2 translate-y-12 group-hover:translate-y-0 transition-transform">
                                <button className="p-1.5 md:p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-md">
                                    <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                </button>
                                <button className="p-1.5 md:p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-md">
                                    <Palette className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-5 md:p-8 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-base md:text-lg font-black text-white italic truncate">{template.name}</h4>
                                    <p className="text-[8px] md:text-[10px] uppercase font-bold text-white/20 tracking-widest">KEY: {template.key}</p>
                                </div>
                                <span className={cn(
                                    "px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[7px] md:text-[8px] font-black uppercase tracking-tighter",
                                    template.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/40"
                                )}>
                                    {template.status}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 md:gap-6 mt-auto">
                                <div>
                                    <p className="text-[8px] md:text-[10px] uppercase font-bold text-white/20 leading-none mb-1">Usage</p>
                                    <p className="text-xs md:text-sm text-white font-black">{template.usage} Sites</p>
                                </div>
                                <div className="ml-auto flex gap-2">
                                    <button className="p-2 md:p-2.5 bg-white/5 hover:bg-white/10 rounded-lg md:rounded-xl text-white/40 hover:text-white transition-all">
                                        <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </button>
                                    <button className="p-2 md:p-2.5 bg-white/5 hover:bg-red-500/10 rounded-lg md:rounded-xl text-white/40 hover:text-red-400 transition-all">
                                        <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Template Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[2000] flex items-center justify-center p-4">
                    <div className="bg-secondary-dark border border-white/5 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-10 relative animate-in zoom-in-95 duration-300 custom-scrollbar">
                        <h3 className="text-xl md:text-3xl font-black text-white italic uppercase mb-6 md:mb-8 leading-tight">Add <span className="text-accent-yellow">Template</span></h3>

                        <div className="space-y-5 md:space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] md:text-[10px] font-black uppercase text-white/20 tracking-widest pl-1 leading-none">Template Name</label>
                                <input type="text" placeholder="e.g. Neon Nights" className="w-full bg-white/5 border border-white/5 outline-none rounded-xl md:rounded-2xl py-3.5 md:py-4 px-5 md:px-6 text-xs md:text-sm font-bold text-white focus:border-accent-yellow/40 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] md:text-[10px] font-black uppercase text-white/20 tracking-widest pl-1 leading-none">Unique Key</label>
                                <input type="text" placeholder="e.g. neon-v1" className="w-full bg-white/5 border border-white/5 outline-none rounded-xl md:rounded-2xl py-3.5 md:py-4 px-5 md:px-6 text-xs md:text-sm font-bold text-white focus:border-accent-yellow/40 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] md:text-[10px] font-black uppercase text-white/20 tracking-widest pl-1 leading-none">Primary Color</label>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <input type="color" defaultValue="#ffc107" className="w-full sm:w-16 h-12 md:h-14 bg-white/5 border border-white/5 rounded-xl md:rounded-2xl cursor-pointer p-1" />
                                    <input type="text" placeholder="#ffc107" className="flex-1 bg-white/5 border border-white/5 outline-none rounded-xl md:rounded-2xl px-5 md:px-6 text-xs md:text-sm font-bold text-white transition-all focus:border-accent-yellow/40" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4">
                            <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 md:py-5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all order-2 sm:order-1">Cancel</button>
                            <button className="flex-1 py-4 md:py-5 bg-accent-yellow hover:bg-yellow-500 text-primary-dark rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all order-1 sm:order-2">Save Template</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateManager;
