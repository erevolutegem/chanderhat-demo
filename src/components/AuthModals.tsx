"use client";

import React from "react";
import { X, Mail, Lock, User, Github } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "login" | "signup";
}

const AuthModals = ({ isOpen, onClose, type }: AuthModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-primary-dark/90 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-secondary-dark rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header Decoration */}
                <div className="h-1 bg-gradient-to-r from-accent-yellow via-orange-500 to-accent-red" />

                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase italic">
                                {type === "login" ? "Welcome" : "Create"} <span className="text-accent-yellow">{type === "login" ? "Back" : "Account"}</span>
                            </h2>
                            <p className="text-white/40 text-xs font-medium uppercase tracking-widest mt-1">
                                Join the elite community
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <X className="w-6 h-6 text-white/20 hover:text-white" />
                        </button>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        {type === "signup" && (
                            <InputField icon={<User className="w-4 h-4" />} placeholder="Full Name" />
                        )}
                        <InputField icon={<Mail className="w-4 h-4" />} placeholder="Email Address" type="email" />
                        <InputField icon={<Lock className="w-4 h-4" />} placeholder="Password" type="password" />

                        <button className="w-full bg-accent-yellow hover:bg-yellow-500 text-primary-dark font-black py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-accent-yellow/10 uppercase tracking-widest text-sm mt-4">
                            {type === "login" ? "Sign In" : "Register Now"}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                        <button className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3 transition-all text-sm">
                            <Github className="w-5 h-5" /> Continue with Google
                        </button>

                        <p className="text-center text-xs text-white/40 font-medium">
                            {type === "login" ? "Don't have an account?" : "Already have an account?"}
                            <button className="text-accent-yellow font-black ml-1 uppercase hover:underline">
                                {type === "login" ? "Sign Up" : "Log In"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ icon, placeholder, type = "text" }: { icon: React.ReactNode; placeholder: string; type?: string }) => (
    <div className="relative group/input">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-accent-yellow transition-colors">
            {icon}
        </div>
        <input
            type={type}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/5 focus:border-accent-yellow/50 outline-none rounded-xl py-3.5 pl-12 pr-4 text-sm text-white transition-all placeholder:text-white/20"
        />
    </div>
);

export default AuthModals;
