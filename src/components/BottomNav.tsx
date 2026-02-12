import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMobileNav } from '../context/MobileNavContext';
import { LayoutDashboard, Target, Sword, DollarSign, User } from 'lucide-react';

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
}

const NAV_ITEMS: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard />, path: '/dashboard' },
    { id: 'goals', label: 'Goals', icon: <Target />, path: '/goals' },
    { id: 'quests', label: 'Quests', icon: <Sword />, path: '/quests' },
    { id: 'economy', label: 'Economy', icon: <DollarSign />, path: '/economy' },
    { id: 'profile', label: 'Profile', icon: <User />, path: '/profile' },
];

export const BottomNav: React.FC = () => {
    const { isMobile } = useMobileNav();
    const navigate = useNavigate();
    const location = useLocation();

    if (!isMobile) return null;

    return (
        <nav className="bottom-nav" role="navigation" aria-label="Mobile Navigation">
            {NAV_ITEMS.map(item => (
                <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    aria-label={item.label}
                    aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>
    );
};
