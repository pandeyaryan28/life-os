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

  // Show loading while auth, game sync, or subscription is loading
  if (loading || (user && isSyncing) || (user && subscriptionLoading)) {
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

  // Not subscribed - show pricing page with subscribe button
  if (!isSubscribed) {
    return <PricingPage />;
  }

  // Subscribed - show dashboard
  return <Dashboard />;
}

export default App;



