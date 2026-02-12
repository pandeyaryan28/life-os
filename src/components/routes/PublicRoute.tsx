import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface PublicRouteProps {
    children: React.ReactNode;
}

/**
 * Wraps public-only routes (login/register).
 * If user is already authenticated, redirect to dashboard.
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (user) {
        return <Navigate to="/lifeosplus/dashboard" replace />;
    }

    return <>{children}</>;
};
