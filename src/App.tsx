import { lazy, Suspense } from 'react';
import { useAuth } from './context/AuthContext';
import { useGameEngine } from './hooks/useGameEngine';

// Lazy Load Components
const Dashboard = lazy(() => import('./components/Dashboard').then(module => ({ default: module.Dashboard })));
const Login = lazy(() => import('./components/Login').then(module => ({ default: module.Login })));
const OnboardingScreen = lazy(() => import('./components/OnboardingScreen').then(module => ({ default: module.OnboardingScreen })));

const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center">
    <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
  </div>
);

function App() {
  const { user, loading } = useAuth();
  const { gameState, updateProfile, isSyncing } = useGameEngine();

  // Show loading while auth or game sync is loading
  if (loading || (user && isSyncing)) {
    return <LoadingSpinner />;
  }

  // Not logged in - show login
  if (!user) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Login />
      </Suspense>
    );
  }

  // Needs onboarding
  const needsOnboarding = !gameState.player.firstName || gameState.player.firstName === 'Player';
  if (needsOnboarding) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <OnboardingScreen
          onComplete={(data) => {
            updateProfile(data);
          }}
        />
      </Suspense>
    );
  }

  // Show dashboard for all users (freemium - features are gated inside)
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Dashboard />
    </Suspense>
  );
}

export default App;
