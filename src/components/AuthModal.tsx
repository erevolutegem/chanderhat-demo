"use client";
import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    type: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, type: initialType }: Props) {
    const [type, setType] = useState(initialType);
    const [showPass, setShowPass] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden animate-[fade-up_0.2s_ease]"
                style={{ background: "linear-gradient(135deg, #1a1a3e 0%, #0d0d2a 100%)", border: "1px solid #2a2a4a" }}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #2a2a4a" }}>
                    <h2 className="font-black text-white text-lg">
                        {type === "login" ? "Welcome Back" : "Create Account"}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white p-1 rounded transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Logo */}
                    <div className="text-center mb-2">
                        <span className="text-2xl font-black text-white">Play<span style={{ color: "#ffd700" }}>Baji</span></span>
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#8888aa" }}>Username</label>
                        <input placeholder="Enter username" className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-red-500/50"
                            style={{ background: "#0d0d1a", border: "1px solid #2a2a4a" }} />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#8888aa" }}>Password</label>
                        <div className="relative">
                            <input type={showPass ? "text" : "password"} placeholder="Enter password"
                                className="w-full rounded-lg px-3 py-2.5 pr-10 text-sm text-white outline-none focus:ring-2 focus:ring-red-500/50"
                                style={{ background: "#0d0d1a", border: "1px solid #2a2a4a" }} />
                            <button onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {type === "register" && (
                        <div>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#8888aa" }}>Phone Number</label>
                            <input placeholder="+880 1XXX-XXXXXX" className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-red-500/50"
                                style={{ background: "#0d0d1a", border: "1px solid #2a2a4a" }} />
                        </div>
                    )}

                    <button className="w-full py-3 rounded-lg font-black text-white text-sm transition-all"
                        style={{ background: "#e02020" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#c01818")}
                        onMouseLeave={e => (e.currentTarget.style.background = "#e02020")}>
                        {type === "login" ? "Login" : "Create Account"}
                    </button>

                    <p className="text-center text-sm" style={{ color: "#7777aa" }}>
                        {type === "login" ? "New to PlayBaji?" : "Already have an account?"}{" "}
                        <button onClick={() => setType(type === "login" ? "register" : "login")}
                            className="font-bold hover:underline" style={{ color: "#ffd700" }}>
                            {type === "login" ? "Register" : "Login"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
