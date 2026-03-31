'use client';
import React, { useEffect, useState } from 'react';
import { useMobileNav, type MobileTab } from '../context/MobileNavContext';
import { LayoutDashboard, Target, Sword, DollarSign, User } from 'lucide-react';

interface NavItem {
    id: MobileTab;
    label: string;
    icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
    { id: 'goals', label: 'Goals', icon: <Target /> },
    { id: 'quests', label: 'Quests', icon: <Sword /> },
    { id: 'economy', label: 'Economy', icon: <DollarSign /> },
    { id: 'profile', label: 'Profile', icon: <User /> },
];

export const BottomNav: React.FC = () => {
    const { isMobile, activeTab, setActiveTab } = useMobileNav();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render on server, wait for client mount
    if (!mounted) return null;

    // Always show on mobile screens (width <= 767px)
    if (!isMobile) return null;

    return (
        <nav
            className="bottom-nav"
            role="navigation"
            aria-label="Mobile Navigation"
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
            }}
        >
            {NAV_ITEMS.map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`bottom-nav-item ${activeTab === item.id ? 'active' : ''}`}
                    aria-label={item.label}
                    aria-current={activeTab === item.id ? 'page' : undefined}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>
    );
};
