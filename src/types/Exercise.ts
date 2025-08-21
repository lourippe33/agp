export interface Exercise {
  id: number;
  titre: string;
  type: 'respiration' | 'meditation' | 'relaxation' | 'coherence';
  image: string;
  duree: number;
  difficulte: 'Très facile' | 'Facile' | 'Moyen';
  tags: string[];
  description: string;
  etapes: string[];
  benefices: string[];
  momentIdeal: string[];
  frequence: string;
  // Nouvelles propriétés pour les vidéos
  videoUrl?: string; // URL de la vidéo principale
  videoThumbnail?: string; // Miniature de la vidéo
  videoDuration?: number; // Durée de la vidéo en secondes
  videoSteps?: VideoStep[]; // Vidéos pour chaque étape
  hasVideo?: boolean; // Indicateur si l'exercice a une vidéo
}

export interface VideoStep {
  stepIndex: number;
  videoUrl: string;
  thumbnail: string;
  duration: number;
  title: string;
}

export interface ExerciseData {
  exercices: Exercise[];
}