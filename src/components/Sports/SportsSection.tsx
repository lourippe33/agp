import { useState, useEffect } from 'react';
import { Dumbbell, Clock, Flame, Search, Play, Video, Pause, RotateCcw, SkipForward } from 'lucide-react';
import exercicesData from './exercices.json';

interface ExerciceFromJson {
  id: number;
  titre: string;
  type: string;
  niveau: string;
  image: string;
  duree: number;
  difficulte: string;
  calories: number;
  tags: string[];
  description: string;
  etapes: string[];
  benefices: string[];
  momentIdeal: string[];
  frequence: string;
  videoUrl: string;
}

interface SportsActivity {
  id: string;
  name: string;
  description: string;
  difficultyLevel: string;
  duration: number;
  caloriesBurned: number;
  category: string;
  imageUrl: string;
  instructions: string[];
  equipmentNeeded: string[];
  videoUrl: string;
}

const convertJsonExercices = (jsonExercices: ExerciceFromJson[]): SportsActivity[] => {
  return jsonExercices.map(ex => ({
    id: ex.id.toString(),
    name: ex.titre,
    description: ex.description,
    difficultyLevel: ex.niveau === 'debutant' ? 'beginner' : ex.niveau === 'intermediaire' ? 'intermediate' : 'advanced',
    duration: ex.duree,
    caloriesBurned: ex.calories,
    category: ex.type.charAt(0).toUpperCase() + ex.type.slice(1),
    imageUrl: ex.image,
    instructions: ex.etapes,
    equipmentNeeded: [],
    videoUrl: ex.videoUrl,
  }));
};

const allActivities = convertJsonExercices(exercicesData.exercices);

interface WorkoutStep {
  name: string;
  duration: number;
  description: string;
}

export function SportsSection() {
  const [activities] = useState<SportsActivity[]>(allActivities);
  const [selectedActivity, setSelectedActivity] = useState<SportsActivity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [workoutSteps, setWorkoutSteps] = useState<WorkoutStep[]>([]);

  const difficulties = [
    { value: 'all', label: 'Tous niveaux' },
    { value: 'beginner', label: 'Débutant' },
    { value: 'intermediate', label: 'Intermédiaire' },
    { value: 'advanced', label: 'Avancé' },
  ];

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || activity.difficultyLevel === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Débutant';
      case 'intermediate':
        return 'Intermédiaire';
      case 'advanced':
        return 'Avancé';
      default:
        return difficulty;
    }
  };

  const generateWorkoutSteps = (activity: SportsActivity): WorkoutStep[] => {
    const steps: WorkoutStep[] = [];
    const totalDuration = activity.duration * 60;

    if (activity.instructions.length === 0) return [];

    // Extraire les durées des descriptions si elles existent
    activity.instructions.forEach((instruction) => {
      // Chercher les patterns comme "(5 min)", "(3 min)", etc.
      const durationMatch = instruction.match(/\((\d+)\s*min\)/i);
      // Chercher aussi les patterns comme "Échauffement (3 min)"
      const titleMatch = instruction.match(/^(\d+\)?\s*)?([^(]+)(?:\((\d+)\s*min\))?/i);

      let duration = 0;
      let name = '';
      let description = instruction;

      if (durationMatch) {
        duration = parseInt(durationMatch[1]) * 60; // Convertir minutes en secondes
      }

      // Extraire le nom de l'étape (avant les deux-points ou la parenthèse)
      if (titleMatch) {
        const fullTitle = titleMatch[0].trim();
        const colonIndex = fullTitle.indexOf(':');
        if (colonIndex > 0) {
          name = fullTitle.substring(0, colonIndex).trim();
          description = fullTitle.substring(colonIndex + 1).trim();
        } else {
          name = fullTitle.replace(/\(\d+\s*min\)/i, '').trim();
        }
      }

      // Si pas de nom trouvé, utiliser un nom par défaut
      if (!name) {
        name = `Étape ${steps.length + 1}`;
      }

      steps.push({
        name,
        duration: duration || 60, // Par défaut 1 minute si pas de durée trouvée
        description
      });
    });

    // Si aucune durée n'a été extraite, répartir équitablement
    const totalExtracted = steps.reduce((sum, step) => sum + step.duration, 0);
    if (totalExtracted === 0 || totalExtracted === steps.length * 60) {
      const stepDuration = Math.floor(totalDuration / steps.length);
      steps.forEach(step => {
        step.duration = stepDuration;
      });
    }

    return steps;
  };

  const startWorkout = () => {
    if (!selectedActivity) return;

    const steps = generateWorkoutSteps(selectedActivity);
    if (steps.length === 0) return;

    setWorkoutSteps(steps);
    setCurrentStepIndex(0);
    setTimeLeft(steps[0].duration);
    setIsWorkoutActive(true);
    setIsPaused(false);
  };

  const nextStep = () => {
    if (currentStepIndex + 1 < workoutSteps.length) {
      setCurrentStepIndex(prev => prev + 1);
      setTimeLeft(workoutSteps[currentStepIndex + 1].duration);
    } else {
      setIsWorkoutActive(false);
    }
  };

  const resetWorkout = () => {
    setIsWorkoutActive(false);
    setCurrentStepIndex(0);
    setTimeLeft(0);
    setIsPaused(false);
    setWorkoutSteps([]);
  };

  const getCompletionMessage = () => {
    const messages = [
      "Ton corps te dit merci ! Chaque séance te rapproche de tes objectifs.",
      "Incroyable ! Tu viens de faire un pas de plus vers une meilleure version de toi-même.",
      "Bravo champion ! La régularité est la clé du succès.",
      "Quelle belle séance ! Tu as fait preuve de détermination.",
      "Tu rayonnes ! Continue comme ça, les résultats suivront.",
      "Félicitations ! Tu as prouvé que tu étais capable d'aller jusqu'au bout.",
      "Wow ! Cette séance est dans la poche. Ton futur toi te remercie !",
      "Superbe performance ! Tu es sur la bonne voie pour atteindre tes objectifs.",
      "Bravo ! Chaque effort compte et tu viens d'en faire la preuve.",
      "Extraordinaire ! Tu as montré ta force et ta persévérance.",
      "Quelle motivation ! Continue ainsi, tu es unstoppable.",
      "Félicitations ! Ton engagement est inspirant.",
      "Tu es une machine ! Cette séance est un succès total.",
      "Chapeau ! Tu viens de prouver que rien ne t'arrête.",
      "Excellent travail ! Ton corps et ton esprit sont en harmonie."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!isWorkoutActive || isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          nextStep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isWorkoutActive, isPaused, timeLeft, currentStepIndex]);

  const getProgressPercentage = () => {
    if (workoutSteps.length === 0) return 0;
    const currentStep = workoutSteps[currentStepIndex];
    if (!currentStep) return 0;
    const elapsed = currentStep.duration - timeLeft;
    return (elapsed / currentStep.duration) * 100;
  };

  const getTotalProgress = () => {
    if (workoutSteps.length === 0) return 0;
    return ((currentStepIndex / workoutSteps.length) * 100);
  };

  if (selectedActivity) {
    if (isWorkoutActive) {
      const currentStep = workoutSteps[currentStepIndex];
      const isFinished = !currentStep;

      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-3 sm:p-6 pb-24">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl font-bold text-[#333333] truncate pr-2">{selectedActivity.name}</h2>
              <button
                onClick={resetWorkout}
                className="px-3 py-2 sm:px-4 text-sm sm:text-base text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold whitespace-nowrap flex-shrink-0"
              >
                Arrêter
              </button>
            </div>

            {!isFinished ? (
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 mb-6">
                <div className="flex flex-col items-center space-y-4 sm:space-y-8">
                  <div className="text-center w-full">
                    <div className="text-sm text-gray-500 mb-2">Progression globale</div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Étape {currentStepIndex + 1} / {workoutSteps.length}</span>
                      <span>{Math.round(getTotalProgress())}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-6">
                      <div
                        className="bg-gradient-to-r from-[#4A7729] to-[#7AC943] h-full transition-all duration-300"
                        style={{ width: `${getTotalProgress()}%` }}
                      />
                    </div>
                  </div>

                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                    <div
                      className="absolute w-full h-full rounded-full bg-gradient-to-br from-green-400 to-emerald-400 transition-all duration-1000 ease-in-out"
                      style={{
                        opacity: 0.2,
                        transform: `scale(${0.6 + (getProgressPercentage() / 100) * 0.4})`
                      }}
                    />
                    <div
                      className="absolute w-4/5 h-4/5 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 transition-all duration-1000 ease-in-out"
                      style={{
                        opacity: 0.4,
                        transform: `scale(${0.6 + (getProgressPercentage() / 100) * 0.4})`
                      }}
                    />
                    <div
                      className="absolute w-3/5 h-3/5 rounded-full bg-gradient-to-br from-[#4A7729] to-[#7AC943] flex items-center justify-center transition-all duration-1000 ease-in-out shadow-2xl"
                      style={{
                        transform: `scale(${0.8 + (getProgressPercentage() / 100) * 0.2})`
                      }}
                    >
                      <div className="text-center text-white">
                        <div className="text-4xl sm:text-6xl font-bold mb-1 sm:mb-2">{formatTime(timeLeft)}</div>
                        <div className="text-xs sm:text-sm uppercase tracking-wider font-semibold opacity-90">
                          Temps restant
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center w-full bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6">
                    <h3 className="text-lg sm:text-2xl font-bold text-[#333333] mb-2 sm:mb-3">{currentStep.name}</h3>
                    <p className="text-gray-700 text-sm sm:text-lg leading-relaxed">{currentStep.description}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    {isPaused ? (
                      <button
                        onClick={() => setIsPaused(false)}
                        className="flex items-center justify-center space-x-2 px-6 py-3 sm:px-8 sm:py-4 bg-[#4A7729] text-white rounded-xl hover:bg-[#3d6322] transition-all font-semibold text-base sm:text-lg shadow-lg transform hover:scale-105 w-full sm:w-auto"
                      >
                        <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span>Reprendre</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsPaused(true)}
                        className="flex items-center justify-center space-x-2 px-6 py-3 sm:px-8 sm:py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all font-semibold text-base sm:text-lg shadow-lg transform hover:scale-105 w-full sm:w-auto"
                      >
                        <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span>Pause</span>
                      </button>
                    )}

                    <button
                      onClick={nextStep}
                      className="flex items-center justify-center space-x-2 px-6 py-3 sm:px-8 sm:py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-semibold text-base sm:text-lg shadow-lg transform hover:scale-105 w-full sm:w-auto"
                    >
                      <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Suivant</span>
                    </button>

                    <button
                      onClick={resetWorkout}
                      className="flex items-center justify-center space-x-2 px-6 py-3 sm:px-8 sm:py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all font-semibold text-base sm:text-lg shadow-lg transform hover:scale-105 w-full sm:w-auto"
                    >
                      <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Recommencer</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-12 text-center">
                <div className="text-6xl sm:text-8xl mb-4 sm:mb-6 animate-bounce">🎉</div>
                <h2 className="text-2xl sm:text-4xl font-bold text-[#4A7729] mb-3 sm:mb-4">
                  Séance terminée !
                </h2>
                <p className="text-base sm:text-xl text-gray-700 mb-3 sm:mb-4">
                  Bravo ! Tu as terminé ta séance <b>{selectedActivity.name}</b>.
                </p>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                  <p className="text-sm sm:text-lg text-[#4A7729] font-semibold italic">
                    {getCompletionMessage()}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <button
                    onClick={resetWorkout}
                    className="flex items-center justify-center space-x-2 px-6 py-3 sm:px-8 sm:py-4 bg-[#4A7729] text-white rounded-xl hover:bg-[#3d6322] transition-all font-semibold text-base sm:text-lg shadow-lg transform hover:scale-105 w-full sm:w-auto"
                  >
                    <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Recommencer</span>
                  </button>
                  <button
                    onClick={() => {
                      resetWorkout();
                      setSelectedActivity(null);
                    }}
                    className="px-6 py-3 sm:px-8 sm:py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all font-semibold text-base sm:text-lg shadow-lg transform hover:scale-105 w-full sm:w-auto"
                  >
                    Retour aux activités
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <button
          onClick={() => {
            setSelectedActivity(null);
            resetWorkout();
          }}
          className="text-[#4A7729] hover:text-[#7AC943] font-semibold"
        >
          ← Retour aux activités
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <img
            src={selectedActivity.imageUrl}
            alt={selectedActivity.name}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-[#333333] mb-2">{selectedActivity.name}</h2>
                <p className="text-gray-600">{selectedActivity.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span>{selectedActivity.duration} min</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Flame className="w-5 h-5" />
                <span>{selectedActivity.caloriesBurned} cal</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(selectedActivity.difficultyLevel)}`}>
                {getDifficultyLabel(selectedActivity.difficultyLevel)}
              </span>
            </div>

            {selectedActivity.videoUrl && (
              <div className="mb-6">
                <button
                  onClick={() => window.open(selectedActivity.videoUrl, '_blank')}
                  className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-[#7AC943] text-white rounded-lg hover:bg-[#6AB833] transition-colors font-semibold shadow-md"
                >
                  <Video className="w-5 h-5" />
                  <span>Voir la vidéo explicative</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-[#333333] mb-3">Équipement nécessaire</h3>
                {selectedActivity.equipmentNeeded.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedActivity.equipmentNeeded.map((equipment, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#7AC943] rounded-full" />
                        <span className="text-gray-700">{equipment}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">Aucun équipement nécessaire</p>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#333333] mb-3">Instructions</h3>
                <ol className="space-y-3">
                  {selectedActivity.instructions.map((instruction, index) => (
                    <li key={index} className="flex space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#7AC943] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={startWorkout}
                className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-[#4A7729] text-white rounded-lg hover:bg-[#3d6322] transition-all font-semibold shadow-lg transform hover:scale-105"
              >
                <Play className="w-5 h-5" />
                <span>Commencer l'activité</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#333333]">Activités sportives</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une activité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.value}
                onClick={() => setFilterDifficulty(difficulty.value)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filterDifficulty === difficulty.value
                    ? 'bg-[#7AC943] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {difficulty.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            onClick={() => setSelectedActivity(activity)}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="relative overflow-hidden">
              <img
                src={activity.imageUrl}
                alt={activity.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(activity.difficultyLevel)}`}>
                  {getDifficultyLabel(activity.difficultyLevel)}
                </span>
              </div>
              {activity.videoUrl && (
                <div className="absolute top-3 right-3 bg-black/70 text-white p-2 rounded-full">
                  <Video className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-lg font-bold text-[#333333] mb-2 group-hover:text-[#4A7729] transition-colors">
                {activity.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{activity.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{activity.duration} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Flame className="w-4 h-4" />
                  <span>{activity.caloriesBurned} cal</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Dumbbell className="w-4 h-4" />
                  <span>{activity.category}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
