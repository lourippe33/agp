import { Heart, TrendingUp, Users } from 'lucide-react';

interface WelcomePageProps {
  onGetStarted: () => void;
}

export function WelcomePage({ onGetStarted }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A9CD9] via-[#3B8FBF] to-[#5FA84D] flex flex-col items-center justify-between p-8 text-white">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md space-y-12">
        <div className="text-center space-y-6 mt-12">
          <h1 className="text-6xl font-serif font-light tracking-wider">
            AGP
          </h1>
          <p className="text-2xl font-light leading-relaxed">
            Bienvenue dans votre parcours santé
          </p>
          <p className="text-lg text-white text-opacity-90 font-light">
            Transformez vos habitudes, atteignez vos objectifs
          </p>
        </div>

        <div className="w-full space-y-10 mt-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm">
              <Heart className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-medium">
              Bien-être quotidien
            </h3>
            <p className="text-base text-white text-opacity-90 font-light leading-relaxed">
              Suivez votre alimentation, sommeil et hydratation
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm">
              <TrendingUp className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-medium">
              Progression visible
            </h3>
            <p className="text-base text-white text-opacity-90 font-light leading-relaxed">
              Visualisez vos progrès avec des graphiques détaillés
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm">
              <Users className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-medium">
              Communauté motivante
            </h3>
            <p className="text-base text-white text-opacity-90 font-light leading-relaxed">
              Partagez et encouragez-vous mutuellement
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md pb-8">
        <button
          onClick={onGetStarted}
          className="w-full bg-white text-[#2B7BBE] rounded-full py-4 px-8 text-xl font-medium hover:bg-opacity-90 transition-all shadow-lg"
        >
          Commencer
        </button>
      </div>
    </div>
  );
}
