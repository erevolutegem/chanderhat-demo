"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface SiteConfig {
    id: number;
    domain: string;
    name: string;
    template: string;
    logoUrl: string | null;
    config: any;
}

interface SiteContextType {
    site: SiteConfig | null;
    loading: boolean;
}

const SiteContext = createContext<SiteContextType>({ site: null, loading: true });

export const SiteProvider = ({ children }: { children: React.ReactNode }) => {
    const [site, setSite] = useState<SiteConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSiteConfig = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dev.chanderhat.com';
                const res = await fetch(`${apiUrl}/v1/site/config`);
                const data = await res.json();
                if (data && data.domain) {
                    setSite(data);
                    // Apply dynamic colors if present
                    if (data.config?.colors) {
                        const root = document.documentElement;
                        Object.entries(data.config.colors).forEach(([key, value]) => {
                            if (typeof value === 'string') {
                                root.style.setProperty(`--color-${key}`, value);
                            }
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to load site config:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSiteConfig();
    }, []);

    return (
        <SiteContext.Provider value={{ site, loading }}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSite = () => useContext(SiteContext);
