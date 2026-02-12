import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';
import { NotFoundPage } from './routes/NotFoundPage';
import { AuthenticatedLayout } from './AuthenticatedLayout';
import { OnboardingGate } from './OnboardingGate';
import { Login } from './Login';

/**
 * PERF v1.8: Route-based code splitting.
 * Each page is lazy-loaded as its own chunk, reducing initial JS payload.
 * Only the minimal code for the current route is loaded on navigation.
 */
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const GoalsPage = lazy(() => import('./pages/GoalsPage').then(m => ({ default: m.GoalsPage })));
const QuestsPage = lazy(() => import('./pages/QuestsPage').then(m => ({ default: m.QuestsPage })));
const EconomyPage = lazy(() => import('./pages/EconomyPage').then(m => ({ default: m.EconomyPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SystemPage = lazy(() => import('./pages/SystemPage').then(m => ({ default: m.SystemPage })));
const GuidePage = lazy(() => import('./pages/GuidePage').then(m => ({ default: m.GuidePage })));
const SupportPage = lazy(() => import('./pages/SupportPage').then(m => ({ default: m.SupportPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));

/** Minimal loading spinner shown while route chunks load */
const RouteFallback = () => (
    <div className="flex items-center justify-center h-screen bg-system-dark">
        <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            <span className="text-[10px] font-mono text-system-text/40 uppercase tracking-widest">Loading Module...</span>
        </div>
    </div>
);

export const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<RouteFallback />}>
                <Routes>
                    {/* Root redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    {/* Public routes */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <PublicRoute>
                                <Login initialMode="REGISTER" />
                            </PublicRoute>
                        }
                    />

                    {/* Public info pages — no auth required */}
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />

                    {/* Protected routes — wrapped in Layout */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <OnboardingGate>
                                    <AuthenticatedLayout />
                                </OnboardingGate>
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/goals" element={<GoalsPage />} />
                        <Route path="/quests" element={<QuestsPage />} />
                        <Route path="/economy" element={<EconomyPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/system" element={<SystemPage />} />
                        <Route path="/guide" element={<GuidePage />} />
                    </Route>

                    {/* 404 page */}
                    <Route path="/404" element={<NotFoundPage />} />

                    {/* Catch-all: any unknown route → 404 */}
                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};
