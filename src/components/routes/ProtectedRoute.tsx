import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Wraps authenticated routes. If user is not logged in, redirects to login.
 * Shows a loading spinner while auth state is resolving — no flicker.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // While auth is resolving, show loading — prevents flash of login page
    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        // Save attempted URL so we can redirect back after login
        return <Navigate to="/lifeosplus/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
