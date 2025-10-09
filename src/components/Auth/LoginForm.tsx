import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn } from 'lucide-react';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const { login, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err?.message?.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect');
      } else if (err?.message?.includes('Email not confirmed')) {
        setError('Veuillez confirmer votre email avant de vous connecter');
      } else {
        setError(err?.message || 'Erreur de connexion. Veuillez réessayer.');
      }
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-[#4A9CD9] p-3 rounded-full">
          <LogIn className="w-8 h-8 text-white" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-center text-[#333333] mb-2">
        Connexion
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Bienvenue sur votre espace bien-être
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#333333] mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent outline-none transition"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-[#333333]">
              Mot de passe
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-[#4A9CD9] hover:text-[#3a7cb9] transition-colors"
            >
              Mot de passe oublié ?
            </button>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent outline-none transition"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#5FA84D] text-white py-3 rounded-lg font-semibold hover:bg-[#4d8a3f] transition-colors"
        >
          Se connecter
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Pas encore de compte?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-[#5FA84D] font-semibold hover:text-[#7AC943] transition-colors"
          >
            Créer un compte
          </button>
        </p>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-[#333333] mb-4">
              Réinitialiser le mot de passe
            </h3>
            <p className="text-gray-600 mb-6">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>

            <div className="mb-6">
              <label htmlFor="reset-email" className="block text-sm font-medium text-[#333333] mb-2">
                Email
              </label>
              <input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent outline-none transition"
                placeholder="votre@email.com"
              />
            </div>

            {resetMessage && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {resetMessage}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                  setResetMessage('');
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  try {
                    await resetPassword(resetEmail);
                    setResetMessage('Email de réinitialisation envoyé ! Vérifiez votre boîte mail.');
                    setTimeout(() => {
                      setShowForgotPassword(false);
                      setResetEmail('');
                      setResetMessage('');
                    }, 3000);
                  } catch (err: any) {
                    setResetMessage(err?.message || 'Erreur lors de l\'envoi de l\'email');
                  }
                }}
                className="flex-1 bg-[#5FA84D] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#4d8a3f] transition-colors"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
