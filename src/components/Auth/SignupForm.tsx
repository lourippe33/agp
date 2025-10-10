import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    const fullName = `${firstName} ${lastName}`.trim();
    setLoading(true);

    try {
      await signup(email, password, fullName);
      setSuccess('Compte créé avec succès! Connexion en cours...');
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err?.message?.includes('already registered')) {
        setError('Cet email est déjà utilisé');
      } else if (err?.message?.includes('Invalid email')) {
        setError('Adresse email invalide');
      } else if (err?.message?.includes('Password')) {
        setError('Mot de passe trop faible (minimum 6 caractères)');
      } else if (err?.message?.includes('Email not confirmed')) {
        setError('Veuillez vérifier votre email et cliquer sur le lien de confirmation avant de vous connecter.');
      } else {
        setError(err?.message || 'Erreur lors de la création du compte. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-[#4A9CD9] p-3 rounded-full">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-center text-[#333333] mb-2">
        Créer un compte
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Commencez votre parcours bien-être
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-[#333333] mb-2">
              Prénom
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent outline-none transition"
              placeholder="Prénom"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-[#333333] mb-2">
              Nom
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent outline-none transition"
              placeholder="Nom"
            />
          </div>
        </div>

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
          <label htmlFor="password" className="block text-sm font-medium text-[#333333] mb-2">
            Mot de passe
          </label>
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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#333333] mb-2">
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#5FA84D] text-white py-3 rounded-lg font-semibold hover:bg-[#4d8a3f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Création en cours...' : 'Créer mon compte'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Déjà un compte?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-[#5FA84D] font-semibold hover:text-[#7AC943] transition-colors"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
}
