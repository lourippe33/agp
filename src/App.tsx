import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { SignupForm } from './components/Auth/SignupForm';
import { Dashboard } from './components/Dashboard/Dashboard';
import { WelcomePage } from './components/Welcome/WelcomePage';
import { OnboardingQuestionnaire } from './components/Onboarding/OnboardingQuestionnaire';
import { supabase } from './lib/supabase';

function AppContent() {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome && !user) {
      setShowWelcome(true);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    } else {
      setCheckingOnboarding(false);
    }
  }, [user]);

  const checkOnboardingStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data && !data.onboarding_completed) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setCheckingOnboarding(false);
    }
  };

  if (loading || checkingOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#B7E576] to-[#7AC943] flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    if (showWelcome) {
      return (
        <WelcomePage
          onGetStarted={() => {
            localStorage.setItem('hasSeenWelcome', 'true');
            setShowWelcome(false);
          }}
        />
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#4A9CD9] via-[#3B8FBF] to-[#5FA84D] flex items-center justify-center p-4">
        {showLogin ? (
          <LoginForm onSwitchToSignup={() => setShowLogin(false)} />
        ) : (
          <SignupForm onSwitchToLogin={() => setShowLogin(true)} />
        )}
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <OnboardingQuestionnaire
        onComplete={() => {
          setShowOnboarding(false);
        }}
      />
    );
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
