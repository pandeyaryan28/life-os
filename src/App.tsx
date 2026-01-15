import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { OnboardingScreen } from './components/OnboardingScreen';
import { useAuth } from './context/AuthContext';
import { useGameEngine } from './hooks/useGameEngine';

function App() {
  const { user, loading } = useAuth();
  const { gameState, updateProfile, isSyncing } = useGameEngine();

  if (loading || (user && isSyncing)) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Login />;

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

  // Dashboard now shows for all users - subscribe banner will appear for non-subscribers
  return <Dashboard />;
}

export default App;


