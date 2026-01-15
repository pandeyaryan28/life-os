import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { OnboardingScreen } from './components/OnboardingScreen';
import { useAuth } from './context/AuthContext';
import { useGameEngine } from './hooks/useGameEngine';

function App() {
  const { user, loading } = useAuth();
  const { gameState, updateProfile, isSyncing } = useGameEngine();

  // Show loading while auth or game sync is loading
  if (loading || (user && isSyncing)) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in - show login
  if (!user) return <Login />;

  // Needs onboarding
  const needsOnboarding = !gameState.player.firstName || gameState.player.firstName === 'Player';
  if (needsOnboarding) {
    return (
      <OnboardingScreen
        onComplete={(data) => {
          updateProfile(data);
        }}
      />
    );
  }

  // Show dashboard for all users (freemium - features are gated inside)
  return <Dashboard />;
}

export default App;




