import { useState } from 'react';
import { Heart, Clock, Search, Play, Wind, Moon, Sparkles } from 'lucide-react';
import detenteData from './detente.json';

interface ExerciceDetenteFromJson {
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
}

interface RelaxationExercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: string;
  imageUrl: string;
  instructions: string;
  benefits: string[];
}

const convertJsonDetente = (jsonExercices: ExerciceDetenteFromJson[]): RelaxationExercise[] => {
  return jsonExercices.map(ex => ({
    id: ex.id.toString(),
    name: ex.titre,
    description: ex.description,
    duration: ex.duree,
    category: ex.type.charAt(0).toUpperCase() + ex.type.slice(1),
    imageUrl: ex.image,
    instructions: ex.etapes.join(' '),
    benefits: ex.benefices,
  }));
};

const allExercises = convertJsonDetente(detenteData.exercices);

/* const mockExercises: RelaxationExercise[] = [
  {
    id: '1',
    name: 'Méditation guidée - Respiration consciente',
    description: 'Apprenez à vous recentrer grâce à une méditation guidée sur la respiration',
    duration: 10,
    category: 'Méditation',
    imageUrl: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructions: 'Installez-vous confortablement, fermez les yeux et concentrez-vous sur votre respiration naturelle. Suivez le guide vocal pour approfondir votre pratique.',
    benefits: ['Réduit le stress', 'Améliore la concentration', 'Favorise le calme intérieur'],
  },
  {
    id: '2',
    name: 'Yoga Nidra - Relaxation profonde',
    description: 'Une pratique de relaxation profonde pour régénérer corps et esprit',
    duration: 20,
    category: 'Yoga',
    imageUrl: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructions: 'Allongez-vous confortablement sur le dos. Laissez-vous guider à travers différentes parties du corps pour une relaxation complète.',
    benefits: ['Sommeil réparateur', 'Récupération profonde', 'Réduction de l\'anxiété'],
  },
  {
    id: '3',
    name: 'Respiration 4-7-8',
    description: 'Technique de respiration pour calmer le système nerveux',
    duration: 5,
    category: 'Respiration',
    imageUrl: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructions: 'Inspirez par le nez pendant 4 secondes, retenez votre souffle pendant 7 secondes, expirez par la bouche pendant 8 secondes. Répétez 4 fois.',
    benefits: ['Aide à l\'endormissement', 'Réduit l\'anxiété', 'Apaise rapidement'],
  },
  {
    id: '4',
    name: 'Stretching doux du soir',
    description: 'Étirements relaxants pour préparer le corps au repos',
    duration: 15,
    category: 'Stretching',
    imageUrl: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructions: 'Série d\'étirements doux et lents pour relâcher les tensions accumulées dans la journée.',
    benefits: ['Détend les muscles', 'Améliore la flexibilité', 'Favorise le sommeil'],
  },
  {
    id: '5',
    name: 'Visualisation positive',
    description: 'Voyage mental guidé vers un lieu de paix et de sérénité',
    duration: 12,
    category: 'Méditation',
    imageUrl: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructions: 'Installez-vous confortablement et laissez-vous transporter vers un lieu apaisant de votre choix.',
    benefits: ['Réduit le stress', 'Améliore l\'humeur', 'Développe la créativité'],
  },
  {
    id: '6',
    name: 'Cohérence cardiaque',
    description: 'Exercice de respiration rythmée pour équilibrer le système nerveux',
    duration: 5,
    category: 'Respiration',
    imageUrl: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructions: 'Respirez pendant 5 minutes à un rythme de 6 respirations par minute: 5 secondes d\'inspiration, 5 secondes d\'expiration.',
    benefits: ['Équilibre émotionnel', 'Gestion du stress', 'Meilleure concentration'],
  },
]; */

export function RelaxationSection() {
  const [exercises] = useState<RelaxationExercise[]>(allExercises);
  const [selectedExercise, setSelectedExercise] = useState<RelaxationExercise | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', 'Respiration', 'Relaxation', 'Meditation'];

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || exercise.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Méditation':
        return Sparkles;
      case 'Yoga':
        return Heart;
      case 'Respiration':
        return Wind;
      case 'Stretching':
        return Moon;
      default:
        return Heart;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Méditation':
        return 'bg-purple-100 text-purple-700';
      case 'Yoga':
        return 'bg-pink-100 text-pink-700';
      case 'Respiration':
        return 'bg-blue-100 text-blue-700';
      case 'Stretching':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (selectedExercise) {
    const CategoryIcon = getCategoryIcon(selectedExercise.category);

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedExercise(null)}
          className="text-[#4A7729] hover:text-[#7AC943] font-semibold"
        >
          ← Retour aux exercices
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <img
            src={selectedExercise.imageUrl}
            alt={selectedExercise.name}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-[#333333] mb-2">{selectedExercise.name}</h2>
                <p className="text-gray-600">{selectedExercise.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span>{selectedExercise.duration} min</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 ${getCategoryColor(selectedExercise.category)}`}>
                <CategoryIcon className="w-4 h-4" />
                <span>{selectedExercise.category}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-[#333333] mb-3">Instructions</h3>
                <p className="text-gray-700 leading-relaxed">{selectedExercise.instructions}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#333333] mb-3">Bienfaits</h3>
                <ul className="space-y-2">
                  {selectedExercise.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#7AC943] rounded-full" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <button className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-[#4A7729] text-white rounded-lg hover:bg-[#3d6322] transition-colors font-semibold">
                <Play className="w-5 h-5" />
                <span>Commencer l'exercice</span>
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
        <h2 className="text-2xl font-bold text-[#333333]">Détente & Relaxation</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un exercice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filterCategory === category
                    ? 'bg-[#7AC943] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'Tous' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => {
          const CategoryIcon = getCategoryIcon(exercise.category);

          return (
            <div
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise)}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={exercise.imageUrl}
                  alt={exercise.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getCategoryColor(exercise.category)}`}>
                    <CategoryIcon className="w-3 h-3" />
                    <span>{exercise.category}</span>
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-[#333333] mb-2 group-hover:text-[#4A7729] transition-colors">
                  {exercise.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{exercise.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{exercise.duration} min</span>
                  </div>
                  <span className="text-[#4A7729] font-medium">{exercise.benefits.length} bienfaits</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
