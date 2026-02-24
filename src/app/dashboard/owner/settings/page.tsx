"use client";

import React from "react";
import { Settings, Shield, Bell, CreditCard, Layout, Lock, Save, User } from "lucide-react";
import { cn } from "@/lib/utils";

const OwnerSettings = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-black uppercase italic text-white italic">Panel <span className="text-accent-yellow text-4xl">Settings</span></h2>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Personal preferences and global system configuration</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Navigation Links */}
                <div className="xl:col-span-1 space-y-2">
                    <SettingsTab icon={<User className="w-5 h-5" />} label="Profile Info" active />
                    <SettingsTab icon={<Shield className="w-5 h-5" />} label="Security" />
                    <SettingsTab icon={<Bell className="w-5 h-5" />} label="Notifications" />
                    <SettingsTab icon={<Layout className="w-5 h-5" />} label="Whitelabel Theme" />
                </div>

                {/* Form Area */}
                <div className="xl:col-span-3">
                    <div className="bg-secondary-dark rounded-[2.5rem] border border-white/5 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
                            <Settings className="w-64 h-64 text-accent-yellow" />
                        </div>

                        <div className="max-w-2xl space-y-12">
                            {/* Profile Section */}
                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-3xl bg-accent-yellow/5 border border-accent-yellow/20 flex items-center justify-center relative group overflow-hidden">
                                        <User className="w-10 h-10 text-accent-yellow transition-transform group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                                            <p className="text-[8px] font-black text-white uppercase tracking-tighter">Change</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-white uppercase tracking-widest italic">Personal Information</h4>
                                        <p className="text-xs text-white/20 font-bold uppercase tracking-widest">Update your basic account details</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <InputField label="Full Name" placeholder="Owner" defaultValue="Owner" />
                                    <InputField label="Email Address" placeholder="owner@abc.com" defaultValue="owner@abc.com" disabled />
                                    <InputField label="Contact Number" placeholder="+880 1XXX XXXXXX" />
                                    <InputField label="Country" placeholder="Bangladesh" />
                                </div>
                            </section>

                            <hr className="border-white/5" />

                            {/* Security Section */}
                            <section className="space-y-8">
                                <h4 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3 italic">
                                    <Lock className="w-5 h-5 text-accent-yellow" /> Change Password
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <InputField label="Current Password" type="password" />
                                    <InputField label="New Password" type="password" />
                                </div>
                            </section>

                            <div className="pt-8 flex justify-end">
                                <button className="flex items-center gap-3 px-12 py-5 bg-accent-yellow hover:bg-yellow-500 text-primary-dark rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-accent-yellow/20 hover:scale-[1.02] active:scale-95">
                                    <Save className="w-5 h-5" /> Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsTab = ({ icon, label, active }: any) => (
    <button className={cn(
        "w-full flex items-center gap-4 px-6 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border group",
        active
            ? "bg-accent-yellow border-accent-yellow text-primary-dark shadow-xl shadow-accent-yellow/10"
            : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10"
    )}>
        <span className={cn(
            "transition-colors",
            active ? "text-primary-dark" : "text-accent-yellow group-hover:scale-110"
        )}>
            {icon}
        </span>
        {label}
    </button>
);

const InputField = ({ label, placeholder, type = "text", defaultValue, disabled }: any) => (
    <div className="space-y-2.5">
        <label className="text-[10px] font-black uppercase text-white/20 tracking-widest pl-1">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            disabled={disabled}
            className={cn(
                "w-full bg-white/5 border border-white/5 outline-none rounded-2xl py-4.5 px-6 text-sm font-bold text-white transition-all focus:border-accent-yellow/40 focus:bg-white/[0.08]",
                disabled && "opacity-50 cursor-not-allowed"
            )}
        />
    </div>
);

export default OwnerSettings;
