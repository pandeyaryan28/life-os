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
                <Route path="/" element={<Navigate to="/lifeosplus/dashboard" replace />} />

                {/* Public routes */}
                <Route
                    path="/lifeosplus/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/lifeosplus/register"
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
                    <Route path="/lifeosplus/dashboard" element={<DashboardPage />} />
                    <Route path="/lifeosplus/goals" element={<GoalsPage />} />
                    <Route path="/lifeosplus/quests" element={<QuestsPage />} />
                    <Route path="/lifeosplus/economy" element={<EconomyPage />} />
                    <Route path="/lifeosplus/profile" element={<ProfilePage />} />
                    <Route path="/lifeosplus/system" element={<SystemPage />} />
                    <Route path="/lifeosplus/guide" element={<GuidePage />} />
                </Route>

                {/* 404 page */}
                <Route path="/lifeosplus/404" element={<NotFoundPage />} />

                {/* Catch-all: any unknown lifeosplus route → 404 */}
                <Route path="/lifeosplus/*" element={<Navigate to="/lifeosplus/404" replace />} />

                {/* Catch-all: any other unknown route → 404 */}
                <Route path="*" element={<Navigate to="/lifeosplus/404" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
