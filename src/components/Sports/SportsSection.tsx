import { useState } from 'react';
import { Dumbbell, Clock, Flame, Search, Play, Video } from 'lucide-react';
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

export function SportsSection() {
  const [activities] = useState<SportsActivity[]>(allActivities);
  const [selectedActivity, setSelectedActivity] = useState<SportsActivity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

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

  if (selectedActivity) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedActivity(null)}
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
              <button className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-[#4A7729] text-white rounded-lg hover:bg-[#3d6322] transition-colors font-semibold">
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
