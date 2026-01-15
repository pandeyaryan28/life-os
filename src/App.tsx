import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { OnboardingScreen } from './components/OnboardingScreen';
import { PricingPage } from './components/PricingPage';
import { useAuth } from './context/AuthContext';
import { useSubscription } from './context/SubscriptionContext';
import { useGameEngine } from './hooks/useGameEngine';

function App() {
  const { user, loading } = useAuth();
  const { gameState, updateProfile, isSyncing } = useGameEngine();
  const { isSubscribed, isLoading: subscriptionLoading } = useSubscription();

  if (loading || (user && isSyncing) || (user && subscriptionLoading)) {
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

  // Check subscription after onboarding
  if (!isSubscribed) {
    return <PricingPage />;
  }

  return <Dashboard />;
}

export default App;

