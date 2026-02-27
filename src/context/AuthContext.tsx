"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Player {
    id: number;
    email: string;
    username: string;
    balance: number;
}

interface AuthContextType {
    user: Player | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: Player) => void;
    logout: () => void;
    updateBalance: (newBalance: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Player | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
        setIsLoaded(true);
    }, []);

    const login = (newToken: string, newUser: Player) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    const updateBalance = (newBalance: number) => {
        if (!user) return;
        const updatedUser = { ...user, balance: newBalance };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    if (!isLoaded) return null; // Wait for initial localstorage check

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!user && !!token,
            login,
            logout,
            updateBalance,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}
