"use client";
import React, { useState } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    type: "login" | "register";
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AuthModal({ isOpen, onClose, type: initialType }: Props) {
    const { login } = useAuth();
    const [type, setType] = useState(initialType);
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form fields
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const endpoint = type === "login" ? "/auth/login" : "/auth/register";
        const payload = type === "login"
            ? { email: username, password } // backend accepts email or username in "email" field
            : { email, username, password };

        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Authentication failed");
            }

            login(data.token, data.player);
            onClose();

            // Clear form
            setEmail("");
            setUsername("");
            setPassword("");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden animate-[fade-up_0.2s_ease]"
                style={{ background: "linear-gradient(135deg, #131220 0%, #1a192a 100%)", border: "1px solid #2d2c45" }}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #2d2c45" }}>
                    <h2 className="font-black text-white text-lg">
                        {type === "login" ? "Welcome Back" : "Create Account"}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white p-1 rounded transition-colors" disabled={loading}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Logo */}
                    <div className="text-center mb-4">
                        <span className="text-2xl font-black text-white">Play<span style={{ color: "#e8173a" }}>Baji</span></span>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg text-sm bg-red-500/10 text-red-500 border border-red-500/20">
                            {error}
                        </div>
                    )}

                    {type === "register" && (
                        <div>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9997b8" }}>Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-red-500/50"
                                style={{ background: "#0d0c1a", border: "1px solid #2d2c45" }}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9997b8" }}>
                            {type === "login" ? "Username or Email" : "Username"}
                        </label>
                        <input
                            required
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder={type === "login" ? "Enter username or email" : "Choose a username"}
                            className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-red-500/50"
                            style={{ background: "#0d0c1a", border: "1px solid #2d2c45" }}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9997b8" }}>Password</label>
                        <div className="relative">
                            <input
                                required
                                minLength={6}
                                type={showPass ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter password (min 6 chars)"
                                className="w-full rounded-lg px-3 py-2.5 pr-10 text-sm text-white outline-none focus:ring-2 focus:ring-red-500/50"
                                style={{ background: "#0d0c1a", border: "1px solid #2d2c45" }}
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-3 mt-2 rounded-lg font-black text-white text-sm transition-all flex items-center justify-center gap-2"
                        style={{ background: "linear-gradient(135deg, #e8173a 0%, #c8102e 100%)", opacity: loading ? 0.7 : 1 }}>
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {type === "login" ? "Login Securely" : "Create Account"}
                    </button>

                    <p className="text-center text-sm mt-4" style={{ color: "#9997b8" }}>
                        {type === "login" ? "New to PlayBaji?" : "Already have an account?"}{" "}
                        <button type="button" onClick={() => { setError(""); setType(type === "login" ? "register" : "login"); }}
                            className="font-bold hover:underline" style={{ color: "#e8173a" }}>
                            {type === "login" ? "Register Now" : "Login"}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}
