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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase italic text-white italic">Design <span className="text-accent-yellow text-4xl">Templates</span></h2>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Manage visual themes and whitelabel skins</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-accent-yellow hover:bg-yellow-500 text-primary-dark rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-accent-yellow/10"
                >
                    <Plus className="w-5 h-5" /> Add New Template
                </button>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <div key={template.id} className="bg-secondary-dark/50 rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-accent-yellow/20 transition-all flex flex-col">
                        {/* Preview Area */}
                        <div className="h-40 bg-white/5 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundColor: template.color }} />
                            <Layout className="w-16 h-16 text-white/10 group-hover:scale-110 group-hover:text-accent-yellow/20 transition-all duration-500" />
                            <div className="absolute bottom-4 right-4 flex gap-2 translate-y-12 group-hover:translate-y-0 transition-transform">
                                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-md">
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-md">
                                    <Palette className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-8 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-lg font-black text-white italic truncate">{template.name}</h4>
                                    <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest">KEY: {template.key}</p>
                                </div>
                                <span className={cn(
                                    "px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter",
                                    template.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/40"
                                )}>
                                    {template.status}
                                </span>
                            </div>

                            <div className="flex items-center gap-6 mt-auto">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-white/20">Usage</p>
                                    <p className="text-white font-black">{template.usage} Sites</p>
                                </div>
                                <div className="ml-auto flex gap-2">
                                    <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="p-2.5 bg-white/5 hover:bg-red-500/10 rounded-xl text-white/40 hover:text-red-400 transition-all">
                                        <Trash2 className="w-4 h-4" />
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
                    <div className="bg-secondary-dark border border-white/5 w-full max-w-xl rounded-[3rem] p-10 relative animate-in zoom-in-95 duration-300">
                        <h3 className="text-3xl font-black text-white italic uppercase mb-8">Add <span className="text-accent-yellow">Template</span></h3>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-white/20 tracking-widest pl-1">Template Name</label>
                                <input type="text" placeholder="e.g. Neon Nights" className="w-full bg-white/5 border border-white/5 outline-none rounded-2xl py-4.5 px-6 text-sm font-bold text-white focus:border-accent-yellow/40" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-white/20 tracking-widest pl-1">Unique Key</label>
                                <input type="text" placeholder="e.g. neon-v1" className="w-full bg-white/5 border border-white/5 outline-none rounded-2xl py-4.5 px-6 text-sm font-bold text-white focus:border-accent-yellow/40" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-white/20 tracking-widest pl-1">Primary Color</label>
                                <div className="flex gap-4">
                                    <input type="color" defaultValue="#ffc107" className="w-16 h-14 bg-white/5 border border-white/5 rounded-2xl cursor-pointer p-1" />
                                    <input type="text" placeholder="#ffc107" className="flex-1 bg-white/5 border border-white/5 outline-none rounded-2xl px-6 text-sm font-bold text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex gap-4">
                            <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Cancel</button>
                            <button className="flex-1 py-5 bg-accent-yellow hover:bg-yellow-500 text-primary-dark rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Save Template</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateManager;
