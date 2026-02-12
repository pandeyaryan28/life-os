import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';
import { NotFoundPage } from './routes/NotFoundPage';
import { AuthenticatedLayout } from './AuthenticatedLayout';
import { OnboardingGate } from './OnboardingGate';
import { Login } from './Login';
import { DashboardPage } from './pages/DashboardPage';
import { GoalsPage } from './pages/GoalsPage';
import { QuestsPage } from './pages/QuestsPage';
import { EconomyPage } from './pages/EconomyPage';
import { ProfilePage } from './pages/ProfilePage';
import { SystemPage } from './pages/SystemPage';
import { GuidePage } from './pages/GuidePage';

export const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
};
