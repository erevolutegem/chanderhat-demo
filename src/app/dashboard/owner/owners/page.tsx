"use client";

import React, { useState } from "react";
import { UsersRound, Plus, Edit, Trash2, Mail, Globe, Calendar, ShieldCheck, MoreVertical, Key } from "lucide-react";
import { cn } from "@/lib/utils";

const WhitelabelOwners = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [owners, setOwners] = useState([
        { id: 1, name: "Zubayer Ahmed", email: "zubayer@owner.com", sites: 3, players: "4,500", status: "Active", joined: "2024-01-10" },
        { id: 2, name: "Imran Khan", email: "imran@owner.com", sites: 1, players: "1,200", status: "Active", joined: "2024-02-05" },
        { id: 3, name: "Sifat Hasan", email: "sifat@owner.com", sites: 0, players: "0", status: "Pending", joined: "2024-02-22" },
    ]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase italic text-white italic">Partner <span className="text-accent-yellow text-4xl">Owners</span></h2>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Manage whitelabel partners and site access permissions</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-accent-yellow hover:bg-yellow-500 text-primary-dark rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-accent-yellow/10"
                >
                    <Plus className="w-5 h-5" /> Provision New Owner
                </button>
            </div>

            {/* Owners Table */}
            <div className="bg-secondary-dark rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-widest text-white/20 border-b border-white/5 bg-white/[0.01]">
                                <th className="px-8 py-6">Owner Info</th>
                                <th className="px-8 py-6 text-center">Managed Sites</th>
                                <th className="px-8 py-6 text-center">User Base</th>
                                <th className="px-8 py-6">Joined Date</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-bold">
                            {owners.map((owner) => (
                                <tr key={owner.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-accent-yellow/10 flex items-center justify-center text-accent-yellow shadow-inner">
                                                <UsersRound className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-white text-sm">{owner.name}</p>
                                                <p className="text-xs text-white/20 font-medium">{owner.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5 group-hover:border-accent-yellow/20 transition-all">
                                            <Globe className="w-3 h-3 text-accent-yellow/40" />
                                            <span className="text-white text-sm">{owner.sites}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="text-white text-sm">{owner.players}</span>
                                    </td>
                                    <td className="px-8 py-6 text-white/20 text-sm font-medium">
                                        {owner.joined}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                owner.status === "Active" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-white/20"
                                            )} />
                                            <span className={cn(
                                                "text-[10px] uppercase font-black tracking-widest",
                                                owner.status === "Active" ? "text-emerald-400" : "text-white/20"
                                            )}>
                                                {owner.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button title="Reset Credentials" className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all shadow-xl">
                                                <Key className="w-4 h-4" />
                                            </button>
                                            <button title="Edit Access" className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all shadow-xl">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button title="Suspend Account" className="p-2.5 bg-white/5 hover:bg-red-500/10 rounded-xl text-white/40 hover:text-red-400 transition-all shadow-xl">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Owner Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[2000] flex items-center justify-center p-4">
                    <div className="bg-secondary-dark border border-white/5 w-full max-w-2xl rounded-[3rem] p-10 relative overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-accent-yellow/5 rounded-full blur-[80px]" />

                        <h3 className="text-3xl font-black text-white italic uppercase mb-8">Provision <span className="text-accent-yellow">Partner</span></h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <ModalInput label="Partner Name" placeholder="e.g. John Doe" />
                                <ModalInput label="Contact Email" placeholder="john@partner.com" />
                            </div>
                            <div className="space-y-6">
                                <ModalInput label="Initial Password" type="password" placeholder="••••••••" />
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 block mb-3 pl-1">Assign Site Quota</label>
                                    <input type="number" placeholder="5" className="w-full bg-white/5 border border-white/5 outline-none rounded-2xl py-4.5 px-6 text-sm font-bold text-white transition-all focus:border-accent-yellow/40" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex gap-4">
                            <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Cancel</button>
                            <button className="flex-1 py-5 bg-accent-yellow hover:bg-yellow-500 text-primary-dark rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-accent-yellow/20">Create Partner</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ModalInput = ({ label, placeholder, type = "text" }: any) => (
    <div className="space-y-2.5">
        <label className="text-[10px] font-black uppercase text-white/20 tracking-widest pl-1">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/5 outline-none rounded-2xl py-4.5 px-6 text-sm font-bold text-white transition-all focus:border-accent-yellow/40"
        />
    </div>
);

export default WhitelabelOwners;
