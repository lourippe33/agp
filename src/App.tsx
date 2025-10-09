import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { SignupForm } from './components/Auth/SignupForm';
import { Dashboard } from './components/Dashboard/Dashboard';
import { WelcomePage } from './components/Welcome/WelcomePage';

function AppContent() {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome && !user) {
      setShowWelcome(true);
    }
  }, [user]);

  if (loading) {
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
