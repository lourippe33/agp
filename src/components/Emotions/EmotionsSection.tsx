import { useState } from 'react';
import { Heart, Search, ArrowLeft } from 'lucide-react';
import emotionsData from './emotions.json';
import { CoherenceCardiaque } from './techniques/CoherenceCardiaque';
import { Respiration478 } from './techniques/Respiration478';
import { Ancrage54321 } from './techniques/Ancrage54321';
import { RespirationCarree } from './techniques/RespirationCarree';
import { EFTTapping } from './techniques/EFTTapping';
import { VisualisationLieu } from './techniques/VisualisationLieu';
import { PetitNuage } from './techniques/PetitNuage';
import { PapillonEMDR } from './techniques/PapillonEMDR';

interface Technique {
  id: number;
  titre: string;
  type: string;
  niveau: string;
  image: string;
  duree: number;
  difficulte: string;
  tags: string[];
  description: string;
  icone: string;
  couleur: string;
  benefices: string[];
  quandUtiliser: string[];
}

const allTechniques: Technique[] = emotionsData.techniques;

const getCategoryColor = (type: string) => {
  switch (type) {
    case 'respiration-guidee':
      return 'bg-blue-100 text-blue-700';
    case 'ancrage':
      return 'bg-green-100 text-green-700';
    case 'tapping':
      return 'bg-orange-100 text-orange-700';
    case 'visualisation':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getCategoryLabel = (type: string) => {
  switch (type) {
    case 'respiration-guidee':
      return 'Respiration guidée';
    case 'ancrage':
      return 'Ancrage';
    case 'tapping':
      return 'Tapping EFT';
    case 'visualisation':
      return 'Visualisation';
    default:
      return type;
  }
};

export function EmotionsSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);
  const [showPractice, setShowPractice] = useState(false);

  const categories = ['all', 'respiration-guidee', 'ancrage', 'tapping', 'visualisation'];

  const filteredTechniques = allTechniques.filter((technique) => {
    const matchesSearch = technique.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technique.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || technique.type === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (showPractice && selectedTechnique) {
    const practiceComponents: Record<number, JSX.Element> = {
      1: <CoherenceCardiaque onClose={() => setShowPractice(false)} />,
      2: <Respiration478 onClose={() => setShowPractice(false)} />,
      3: <Ancrage54321 onClose={() => setShowPractice(false)} />,
      4: <RespirationCarree onClose={() => setShowPractice(false)} />,
      5: <EFTTapping onClose={() => setShowPractice(false)} />,
      6: <VisualisationLieu onClose={() => setShowPractice(false)} />,
      7: <PetitNuage onClose={() => setShowPractice(false)} />,
      8: <PapillonEMDR onClose={() => setShowPractice(false)} />,
    };

    return practiceComponents[selectedTechnique.id] || null;
  }

  if (selectedTechnique) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedTechnique(null)}
          className="flex items-center space-x-2 text-[#2B7BBE] hover:text-[#2364A5] font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux techniques</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <img
            src={selectedTechnique.image}
            alt={selectedTechnique.titre}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-[#333333] mb-2">{selectedTechnique.titre}</h2>
                <p className="text-gray-600 text-lg">{selectedTechnique.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6 flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(selectedTechnique.type)}`}>
                {getCategoryLabel(selectedTechnique.type)}
              </span>
              <span className="text-gray-600 flex items-center space-x-1">
                <span className="font-semibold">{selectedTechnique.duree} min</span>
              </span>
              <span className="text-gray-600">
                <span className="font-semibold">Niveau:</span> {selectedTechnique.niveau}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#333333] mb-3">Bienfaits</h3>
                <ul className="space-y-2">
                  {selectedTechnique.benefices.map((benefice, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-[#5FA84D] rounded-full mt-2" />
                      <span className="text-gray-700">{benefice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#333333] mb-3">Quand l'utiliser ?</h3>
                <ul className="space-y-2">
                  {selectedTechnique.quandUtiliser.map((moment, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-[#2B7BBE] rounded-full mt-2" />
                      <span className="text-gray-700">{moment}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowPractice(true)}
              className="w-full bg-gradient-to-r from-[#2B7BBE] to-[#5FA84D] text-white rounded-xl p-4 font-bold text-lg hover:shadow-lg transition-all"
            >
              Commencer la pratique guidée
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#333333]">Gestion des Émotions</h2>
          <p className="text-gray-600 mt-1">Techniques pour gérer stress, anxiété et émotions</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-[#2B7BBE] p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <Heart className="w-5 h-5 text-[#2B7BBE] mt-1 flex-shrink-0" />
          <div>
            <p className="font-semibold text-[#333333] mb-1">Pratique régulière recommandée</p>
            <p className="text-sm text-gray-700">
              Ces techniques sont plus efficaces pratiquées régulièrement. Commencez par la cohérence cardiaque,
              puis explorez les autres selon vos besoins.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une technique..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7BBE] focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filterCategory === category
                    ? 'bg-[#2B7BBE] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'Toutes' : getCategoryLabel(category)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechniques.map((technique) => (
          <div
            key={technique.id}
            onClick={() => setSelectedTechnique(technique)}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="relative overflow-hidden">
              <img
                src={technique.image}
                alt={technique.titre}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(technique.type)}`}>
                  {getCategoryLabel(technique.type)}
                </span>
              </div>
              <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
                {technique.duree} min
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-bold text-[#333333] mb-2 group-hover:text-[#2B7BBE] transition-colors">
                {technique.titre}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{technique.description}</p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{technique.difficulte}</span>
                <span className="text-[#2B7BBE] font-medium">{technique.benefices.length} bienfaits</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
