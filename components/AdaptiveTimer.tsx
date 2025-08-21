import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface TimerPhase {
  name: string;
  duration: number; // en secondes
  type: 'work' | 'rest' | 'preparation';
  instruction?: string;
}

interface AdaptiveTimerProps {
  exerciseTitle: string;
  exerciseSteps: string[];
  totalDuration: number; // en minutes
  exerciseType: 'sport' | 'detente';
  onComplete?: () => void;
}

const extractAllDurations = (step: string): number[] => {
  const durations: number[] = [];
  
  // Patterns pour extraire les durées
  const patterns = [
    // Minutes
    /(\d+)\s*min(?:utes?)?/gi,
    // Secondes
    /(\d+)\s*sec(?:ondes?)?/gi,
    // Format "X fois Y minutes"
    /(\d+)\s*fois.*?(\d+)\s*min/gi,
    // Format "X x Y min"
    /(\d+)\s*x.*?(\d+)\s*min/gi,
    // Format "X rounds de Y min"
    /(\d+)\s*rounds?.*?(\d+)\s*min/gi
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(step)) !== null) {
      if (pattern.source.includes('fois') || pattern.source.includes('x') || pattern.source.includes('rounds')) {
        // Format avec répétitions
        const repetitions = parseInt(match[1]);
        const timePerRep = parseInt(match[2]) * 60; // Convertir en secondes
        for (let i = 0; i < repetitions; i++) {
          durations.push(timePerRep);
        }
      } else {
        // Durée simple
        const time = parseInt(match[1]);
        const isMinutes = match[0].toLowerCase().includes('min');
        durations.push(isMinutes ? time * 60 : time);
      }
    }
  });
  
  // Cas spéciaux pour certains exercices
  if (step.toLowerCase().includes('tabata') || (step.includes('20 sec') && step.includes('10 sec'))) {
    // Tabata : 8 rounds de 20s effort + 10s repos
    for (let i = 0; i < 8; i++) {
      durations.push(20); // Effort
      if (i < 7) durations.push(10); // Repos (sauf dernier round)
    }
  }
  
  if (step.toLowerCase().includes('circuit') && step.includes('30 sec')) {
    // Circuit avec exercices de 30 sec
    const exerciseCount = (step.match(/\w+\s*:/g) || []).length;
    for (let i = 0; i < exerciseCount; i++) {
      durations.push(30); // Chaque exercice
      if (i < exerciseCount - 1) durations.push(15); // Repos entre exercices
    }
  }
  
  return durations;
};

const getPhaseType = (step: string): 'work' | 'rest' | 'preparation' => {
  const stepLower = step.toLowerCase();
  
  if (stepLower.includes('échauffement') || stepLower.includes('préparation')) {
    return 'preparation';
  }
  
  if (stepLower.includes('repos') || 
      stepLower.includes('récupération') || 
      stepLower.includes('retour au calme') ||
      stepLower.includes('étirement') ||
      stepLower.includes('relaxation')) {
    return 'rest';
  }
  
  return 'work';
};

const estimateStepDuration = (step: string, totalSeconds: number, totalSteps: number, stepIndex: number): number => {
  const stepLower = step.toLowerCase();
  
  // Durées fixes pour certains types d'étapes
  if (stepLower.includes('échauffement')) {
    return Math.min(180, Math.floor(totalSeconds * 0.15)); // 15% du temps total, max 3 min
  }
  
  if (stepLower.includes('retour au calme') || stepLower.includes('récupération')) {
    return Math.min(120, Math.floor(totalSeconds * 0.10)); // 10% du temps total, max 2 min
  }
  
  if (stepLower.includes('étirement')) {
    return Math.min(180, Math.floor(totalSeconds * 0.15)); // 15% du temps total, max 3 min
  }
  
  // Pour les autres étapes, répartir le temps restant
  const reservedTime = Math.floor(totalSeconds * 0.25); // 25% pour échauffement/récupération
  const availableTime = totalSeconds - reservedTime;
  const workSteps = totalSteps - 2; // Exclure échauffement et récupération
  
  return Math.max(30, Math.floor(availableTime / Math.max(1, workSteps))); // Minimum 30 secondes
};

const adjustPhasesTotalDuration = (phases: TimerPhase[], targetSeconds: number): TimerPhase[] => {
  const currentTotal = phases.reduce((sum, phase) => sum + phase.duration, 0);
  const ratio = targetSeconds / currentTotal;
  
  return phases.map(phase => ({
    ...phase,
    duration: Math.max(15, Math.floor(phase.duration * ratio)) // Minimum 15 secondes
  }));
};

const analyzeGenericExercise = (steps: string[], duration: number): TimerPhase[] => {
  const totalSeconds = duration * 60;
  const phases: TimerPhase[] = [];
  
  // Filtrer les étapes qui ne sont pas des phases séparées
  const validSteps = steps.filter(step => {
    const stepLower = step.toLowerCase();
    return !stepLower.includes('ralentissez progressivement') &&
           !stepLower.includes('augmentez progressivement') &&
           !stepLower.includes('dernières minutes') &&
           step.trim().length > 0;
  });
  
  validSteps.forEach((step, index) => {
    // Extraire les durées spécifiées dans l'étape
    const extractedDurations = extractAllDurations(step);
    
    if (extractedDurations.length > 0) {
      // Utiliser les durées extraites
      extractedDurations.forEach((duration, durIndex) => {
        const isRest = durIndex % 2 === 1 && step.toLowerCase().includes('repos');
        phases.push({
          name: `${step.split('.')[0]} ${durIndex > 0 ? `(${durIndex + 1})` : ''}`.trim(),
          duration: duration,
          type: isRest ? 'rest' : getPhaseType(step),
          instruction: step
        });
      });
    } else {
      // Estimer la durée basée sur le type d'étape
      const estimatedDuration = estimateStepDuration(step, totalSeconds, validSteps.length, index);
      phases.push({
        name: step.split('.')[0].trim(),
        duration: estimatedDuration,
        type: getPhaseType(step),
        instruction: step
      });
    }
  });
  
  // Filtrer les phases avec durée <= 0
  const validPhases = phases.filter(phase => phase.duration > 0);
  
  // Ajuster pour respecter la durée totale
  return adjustPhasesTotalDuration(validPhases, totalSeconds);
};

export default function AdaptiveTimer({ 
  exerciseTitle, 
  exerciseSteps, 
  totalDuration, 
  exerciseType,
  onComplete 
}: AdaptiveTimerProps) {
  const [phases, setPhases] = useState<TimerPhase[]>([]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Analyser l'exercice selon ses spécifications exactes
  useEffect(() => {
    const analyzedPhases = analyzeExerciseSpecs(exerciseSteps, totalDuration, exerciseTitle);
    setPhases(analyzedPhases);
    if (analyzedPhases.length > 0) {
      setTimeRemaining(analyzedPhases[0].duration);
      setIsInitialized(true);
    }
  }, [exerciseSteps, totalDuration, exerciseTitle, exerciseType]);

  const analyzeExerciseSpecs = (steps: string[], duration: number, title: string): TimerPhase[] => {
    const phases: TimerPhase[] = [];
    
    // Analyser chaque étape selon les spécifications exactes du JSON
    if (title === "Cardio Brûle-Graisse") {
      return [
        { name: "Échauffement", duration: 180, type: 'preparation', instruction: "Marche rapide sur place, montées de genoux légères, cercles de bras" },
        { name: "Jumping jacks", duration: 120, type: 'work', instruction: "Ouvre et ferme les jambes en sautant, bras qui montent et descendent" },
        { name: "Squats dynamiques", duration: 120, type: 'work', instruction: "Plie les genoux comme pour t'asseoir, puis remonte en rythme" },
        { name: "Montées de genoux", duration: 120, type: 'work', instruction: "Cours sur place en montant les genoux à hauteur de hanches" },
        { name: "Fentes alternées", duration: 120, type: 'work', instruction: "Avance un pied, plie les genoux à 90°, puis change de jambe" },
        { name: "Pompes simplifiées", duration: 120, type: 'work', instruction: "Au sol, mains sous les épaules, sur genoux si besoin" },
        { name: "Circuit final", duration: 300, type: 'work', instruction: "Enchaîne jumping jacks, squats et montées de genoux, 30 sec chaque exercice, sans pause" },
        { name: "Retour au calme", duration: 120, type: 'rest', instruction: "Marche lente sur place + étirements jambes et bras" }
      ];
    }
    
    if (title === "HIIT Intensif") {
      const phases: TimerPhase[] = [
        { name: "Échauffement", duration: 180, type: 'preparation', instruction: "Marche rapide ou petits sauts sur place. Ajoute quelques rotations de bras et de hanches" }
      ];
      
      // 8 rounds de 30s effort + 30s repos
      for (let i = 1; i <= 8; i++) {
        phases.push({
          name: `HIIT Round ${i}`,
          duration: 30,
          type: 'work',
          instruction: `Effort très intense : Burpees, Sprint sur place, Squat jumps ou Pompes`
        });
        if (i < 8) {
          phases.push({
            name: `Repos ${i}`,
            duration: 30,
            type: 'rest',
            instruction: "Repos actif, bois de l'eau si nécessaire"
          });
        }
      }
      
      phases.push(
        { name: "Récupération active", duration: 120, type: 'rest', instruction: "Marche lente pour faire redescendre le rythme cardiaque" },
        { name: "Étirements", duration: 180, type: 'rest', instruction: "Étire les cuisses, les bras, et respire profondément" }
      );
      
      return phases;
    }
    
    if (title === "Yoga Dynamique") {
      return [
        { name: "Salutations au soleil", duration: 300, type: 'preparation', instruction: "Commence debout, mains jointes. Inspire, lève les bras au ciel. Expire, penche-toi en avant..." },
        { name: "Postures debout", duration: 480, type: 'work', instruction: "Passe en guerrier 1, puis guerrier 2. Ajoute la posture du triangle. Répète 2 fois par côté" },
        { name: "Séquence d'équilibre", duration: 300, type: 'work', instruction: "Posture de l'arbre et du danseur. Tiens 15-20 secondes, chaque côté" },
        { name: "Postures au sol", duration: 420, type: 'work', instruction: "Alterne cobra et chien tête en bas. Répète 3 fois cette alternance" },
        { name: "Relaxation finale", duration: 300, type: 'rest', instruction: "Allonge-toi sur le dos en savasana. Relâche tout le corps pendant 5 minutes" }
      ];
    }
    
    if (title === "Pilates Minceur") {
      return [
        { name: "Échauffement", duration: 180, type: 'preparation', instruction: "Respiration + rotations d'épaules et de tête" },
        { name: "Abdos faciles", duration: 180, type: 'work', instruction: "Allongé sur le dos, monte la tête et les épaules. 10 répétitions par jambe" },
        { name: "Jambes actives", duration: 180, type: 'work', instruction: "Lève une jambe tendue, dessine 5 cercles dans chaque sens. Change de jambe" },
        { name: "Dos renforcé", duration: 180, type: 'work', instruction: "Sur le ventre, monte bras et jambes alternés comme si tu nageais" },
        { name: "Étirements finaux", duration: 180, type: 'rest', instruction: "Assis, penche le buste vers l'avant. Enchaîne dos rond et dos creux" }
      ];
    }
    
    if (title === "Stretching Actif") {
      return [
        { name: "Échauffement articulaire", duration: 180, type: 'preparation', instruction: "Cercles de tête, épaules et bassin. 5 fois dans chaque sens" },
        { name: "Étirements des jambes", duration: 480, type: 'work', instruction: "Genoux à la poitrine, talon-fesse, étirements des ischio-jambiers. 20s par étirement" },
        { name: "Mobilisation colonne", duration: 300, type: 'work', instruction: "Torsions du buste et flexion avant. Répète 3 fois" },
        { name: "Étirements bras & épaules", duration: 180, type: 'work', instruction: "Étire chaque bras 20s, ouvre les coudes en arrière" },
        { name: "Relaxation finale", duration: 60, type: 'rest', instruction: "Secoue bras et jambes, respire profondément 3 fois" }
      ];
    }
    
    if (title === "Circuit Training Maison") {
      const phases: TimerPhase[] = [
        { name: "Échauffement", duration: 180, type: 'preparation', instruction: "Marche rapide sur place en balançant les bras" }
      ];
      
      // 3 circuits de 5 exercices
      for (let circuit = 1; circuit <= 3; circuit++) {
        phases.push(
          { name: `Circuit ${circuit} - Squats`, duration: 30, type: 'work', instruction: "Plie les genoux comme si tu allais t'asseoir, garde le dos droit" },
          { name: `Repos`, duration: 15, type: 'rest', instruction: "Repos actif" },
          { name: `Circuit ${circuit} - Pompes`, duration: 30, type: 'work', instruction: "Au sol, mains sous les épaules. Si c'est difficile, fais-les à genoux" },
          { name: `Repos`, duration: 15, type: 'rest', instruction: "Repos actif" },
          { name: `Circuit ${circuit} - Mountain climbers`, duration: 30, type: 'work', instruction: "Position planche, ramène alternativement les genoux vers la poitrine rapidement" },
          { name: `Repos`, duration: 15, type: 'rest', instruction: "Repos actif" },
          { name: `Circuit ${circuit} - Fentes`, duration: 30, type: 'work', instruction: "Avance un pied, plie les genoux à 90°, puis change de jambe" },
          { name: `Repos`, duration: 15, type: 'rest', instruction: "Repos actif" },
          { name: `Circuit ${circuit} - Jumping jacks`, duration: 30, type: 'work', instruction: "Sauts écartés avec bras qui montent et descendent" }
        );
        if (circuit < 3) {
          phases.push({ name: `Repos entre circuits`, duration: 60, type: 'rest', instruction: "Récupération active" });
        }
      }
      
      phases.push({ name: "Retour au calme", duration: 120, type: 'rest', instruction: "Étire doucement les jambes et les bras" });
      return phases;
    }
    
    if (title === "Mini Tabata") {
      const phases: TimerPhase[] = [];
      
      // 3 séquences complètes
      for (let sequence = 1; sequence <= 3; sequence++) {
        phases.push(
          { name: `Séq ${sequence} - Jumping jacks`, duration: 20, type: 'work', instruction: "Saute en ouvrant bras et jambes, rythme rapide mais contrôlé" },
          { name: `Repos`, duration: 10, type: 'rest', instruction: "Repos actif" },
          { name: `Séq ${sequence} - Squats`, duration: 20, type: 'work', instruction: "Plie les genoux comme pour t'asseoir, dos droit" },
          { name: `Repos`, duration: 10, type: 'rest', instruction: "Repos actif" },
          { name: `Séq ${sequence} - Pompes genoux`, duration: 20, type: 'work', instruction: "Mains sous les épaules, genoux posés, garde le dos droit" },
          { name: `Repos`, duration: 10, type: 'rest', instruction: "Repos actif" },
          { name: `Séq ${sequence} - Planche`, duration: 20, type: 'work', instruction: "Position gainage, avant-bras au sol, corps droit, abdos serrés" },
          { name: `Repos`, duration: 10, type: 'rest', instruction: "Repos actif" }
        );
        if (sequence < 3) {
          phases.push({ name: `Pause longue`, duration: 30, type: 'rest', instruction: "Bois une gorgée d'eau, marche sur place" });
        }
      }
      
      return phases;
    }
    
    if (title === "Yoga doux perte de poids") {
      return [
        { name: "Chat-vache", duration: 120, type: 'preparation', instruction: "À quatre pattes, creuse et arrondis le dos doucement. Répète 6 fois" },
        { name: "Chien tête en bas", duration: 180, type: 'work', instruction: "Forme un V inversé, garde les talons vers le sol. 30s x 3 fois avec repos" },
        { name: "Guerrier 1 et 2", duration: 360, type: 'work', instruction: "Guerrier 1 puis 2. Tiens 20s chaque posture, chaque côté, répète 2 fois" },
        { name: "Planche + cobra", duration: 300, type: 'work', instruction: "Planche 10-20s puis cobra. Répète 3 fois" },
        { name: "Respiration finale", duration: 240, type: 'rest', instruction: "Allongé sur le dos, mains sur le ventre, respire calmement 1-2 minutes" }
      ];
    }
    
    if (title === "Chaise Brûle-Graisse") {
      return [
        { name: "Échauffement", duration: 60, type: 'preparation', instruction: "Marche sur place en s'aidant du dossier (rythme léger)" },
        { name: "Assis→Debout", duration: 120, type: 'work', instruction: "Assieds-toi puis relève-toi sans t'aider des mains, rythme régulier" },
        { name: "Montées de genoux", duration: 120, type: 'work', instruction: "Touche le dossier d'une main, lève les genoux tour à tour à hauteur de hanches" },
        { name: "Fentes appuyées", duration: 120, type: 'work', instruction: "Une main sur le dossier, fais des fentes alternées en contrôle" },
        { name: "Pompes inclinées", duration: 120, type: 'work', instruction: "Mains sur l'assise, corps gainé, fléchis les coudes puis repousse" },
        { name: "Circuit final", duration: 120, type: 'work', instruction: "30s assis→debout + 30s montées de genoux + 30s pompes inclinées + 30s marche" },
        { name: "Retour au calme", duration: 60, type: 'rest', instruction: "Étire quadriceps et épaules en douceur" }
      ];
    }
    
    if (title === "Abdos + Cardio Express") {
      const phases: TimerPhase[] = [];
      
      // 3 séquences de 4 exercices
      for (let seq = 1; seq <= 3; seq++) {
        phases.push(
          { name: `Séq ${seq} - Jumping jacks`, duration: 30, type: 'work', instruction: "Sauts écartés avec bras" },
          { name: `Repos`, duration: 15, type: 'rest', instruction: "Repos actif" },
          { name: `Séq ${seq} - Crunchs`, duration: 30, type: 'work', instruction: "Crunchs au sol, contracte les abdos" },
          { name: `Repos`, duration: 15, type: 'rest', instruction: "Repos actif" },
          { name: `Séq ${seq} - Montées genoux`, duration: 30, type: 'work', instruction: "Cours sur place, genoux hauts" },
          { name: `Repos`, duration: 15, type: 'rest', instruction: "Repos actif" },
          { name: `Séq ${seq} - Gainage`, duration: 30, type: 'work', instruction: "Gainage avant-bras, corps droit" },
          { name: `Repos`, duration: 30, type: 'rest', instruction: "Récupération active" }
        );
      }
      
      phases.push({ name: "Retour au calme", duration: 120, type: 'rest', instruction: "Étire abdos (cobra doux) et jambes" });
      return phases;
    }
    
    if (title === "Marche active sur place") {
      return [
        { name: "Préparation", duration: 30, type: 'preparation', instruction: "Tiens-toi debout, pieds écartés à la largeur des hanches. Commence à lever les genoux l'un après l'autre." },
        { name: "Marche active", duration: 600, type: 'work', instruction: "Continue ainsi pendant 10 minutes. Balance les bras naturellement comme si tu marchais vite. Garde un rythme soutenu sans t'essouffler." }
      ];
    }
    
    if (title === "Marche Active Débutant") {
      return [
        { name: "Échauffement", duration: 120, type: 'preparation', instruction: "Échauffez-vous 2 minutes en marchant lentement" },
        { name: "Accélération", duration: 120, type: 'work', instruction: "Accélérez le rythme : vous devez pouvoir parler mais être légèrement essoufflé" },
        { name: "Marche soutenue", duration: 600, type: 'work', instruction: "Maintenez ce rythme pendant 10 minutes" },
        { name: "Ralentissement", duration: 180, type: 'rest', instruction: "Ralentissez progressivement les 3 dernières minutes" }
      ];
    }
    
    if (title === "Renforcement bas du corps") {
      return [
        { name: "Squats - Série 1", duration: 90, type: 'work', instruction: "3 séries de 10 squats, contrôle les mouvements" },
        { name: "Repos", duration: 30, type: 'rest', instruction: "Récupération active" },
        { name: "Squats - Série 2", duration: 90, type: 'work', instruction: "3 séries de 10 squats, garde le dos droit" },
        { name: "Repos", duration: 30, type: 'rest', instruction: "Récupération active" },
        { name: "Squats - Série 3", duration: 90, type: 'work', instruction: "3 séries de 10 squats, contrôle la descente" },
        { name: "Fentes - Série 1", duration: 90, type: 'work', instruction: "3 séries de 10 fentes alternées" },
        { name: "Repos", duration: 30, type: 'rest', instruction: "Récupération active" },
        { name: "Fentes - Série 2", duration: 90, type: 'work', instruction: "3 séries de 10 fentes alternées" },
        { name: "Repos", duration: 30, type: 'rest', instruction: "Récupération active" },
        { name: "Fentes - Série 3", duration: 90, type: 'work', instruction: "3 séries de 10 fentes alternées" },
        { name: "Position chaise", duration: 90, type: 'work', instruction: "3 fois 30 secondes contre le mur" },
        { name: "Étirements", duration: 120, type: 'rest', instruction: "2 minutes d'étirement doux des jambes" }
      ];
    }
    
    if (title === "Gainage facile") {
      return [
        { name: "Planche ventrale 1", duration: 30, type: 'work', instruction: "Planche sur avant-bras, corps droit" },
        { name: "Repos", duration: 15, type: 'rest', instruction: "Récupération" },
        { name: "Planche latérale gauche 1", duration: 30, type: 'work', instruction: "Planche sur le côté gauche" },
        { name: "Repos", duration: 15, type: 'rest', instruction: "Récupération" },
        { name: "Planche latérale droite 1", duration: 30, type: 'work', instruction: "Planche sur le côté droit" },
        { name: "Repos", duration: 30, type: 'rest', instruction: "Récupération longue" },
        { name: "Planche ventrale 2", duration: 30, type: 'work', instruction: "Planche sur avant-bras, abdos engagés" },
        { name: "Repos", duration: 15, type: 'rest', instruction: "Récupération" },
        { name: "Planche latérale gauche 2", duration: 30, type: 'work', instruction: "Planche sur le côté gauche" },
        { name: "Repos", duration: 15, type: 'rest', instruction: "Récupération" },
        { name: "Planche latérale droite 2", duration: 30, type: 'work', instruction: "Planche sur le côté droit" },
        { name: "Repos", duration: 30, type: 'rest', instruction: "Récupération longue" },
        { name: "Planche ventrale 3", duration: 30, type: 'work', instruction: "Planche finale, tiens bon !" },
        { name: "Repos", duration: 15, type: 'rest', instruction: "Récupération" },
        { name: "Planche latérale gauche 3", duration: 30, type: 'work', instruction: "Dernière planche gauche" },
        { name: "Repos", duration: 15, type: 'rest', instruction: "Récupération" },
        { name: "Planche latérale droite 3", duration: 30, type: 'work', instruction: "Dernière planche droite" },
        { name: "Étirements", duration: 60, type: 'rest', instruction: "Étire le dos et respire calmement" }
      ];
    }
    
    // Pour les autres exercices, analyse générique basée sur les étapes
    return analyzeGenericExercise(steps, duration);
  };

  // Analyser les exercices de détente selon leurs spécifications exactes
  const analyzeDetenteSpecs = (steps: string[], duration: number, title: string): TimerPhase[] => {
    if (title === "Cohérence Cardiaque Relax 4-6") {
      return [
        { name: "Installation", duration: 30, type: 'preparation', instruction: "Asseyez-vous confortablement, les pieds bien au sol. Posez une main sur votre ventre." },
        { name: "Respiration 4-6", duration: 270, type: 'work', instruction: "Inspirez par le nez en comptant jusqu'à 4, expirez par la bouche en comptant jusqu'à 6. Continuez ce rythme sans forcer." }
      ];
    }
    
    if (title === "Respiration du Sourire") {
      return [
        { name: "Respiration du Sourire", duration: 120, type: 'work', instruction: "Esquissez un léger sourire, inspirez lentement en gardant le sourire, expirez doucement en relâchant les tensions." }
      ];
    }
    
    if (title === "Étirements Doux Assis") {
      return [
        { name: "Position", duration: 15, type: 'preparation', instruction: "Asseyez-vous bien droit sur votre chaise" },
        { name: "Épaules", duration: 60, type: 'work', instruction: "Roulez lentement les épaules vers l'arrière (5 fois)" },
        { name: "Tête", duration: 45, type: 'work', instruction: "Tournez doucement la tête à droite puis à gauche (3 fois)" },
        { name: "Bras", duration: 60, type: 'work', instruction: "Levez les bras vers le ciel et étirez-vous" },
        { name: "Respiration", duration: 120, type: 'rest', instruction: "Terminez en respirant profondément" }
      ];
    }
    
    if (title === "Méditation des 5 Sens") {
      return [
        { name: "5 choses à voir", duration: 60, type: 'work', instruction: "Identifiez 5 choses que vous voyez autour de vous" },
        { name: "4 sons à entendre", duration: 60, type: 'work', instruction: "Écoutez 4 sons différents dans votre environnement" },
        { name: "3 textures à toucher", duration: 60, type: 'work', instruction: "Touchez 3 objets et ressentez leur texture" },
        { name: "2 odeurs à sentir", duration: 60, type: 'work', instruction: "Sentez 2 odeurs (parfum, nourriture, air frais)" },
        { name: "1 goût", duration: 60, type: 'work', instruction: "Goûtez 1 chose (salive, tisane, bonbon)" }
      ];
    }
    
    if (title === "Auto-massage des Mains") {
      return [
        { name: "Réchauffement", duration: 30, type: 'preparation', instruction: "Frottez vos paumes l'une contre l'autre pour les réchauffer" },
        { name: "Massage des doigts", duration: 60, type: 'work', instruction: "Massez chaque doigt de la base vers l'extrémité" },
        { name: "Points de pression", duration: 45, type: 'work', instruction: "Pressez doucement le point au centre de chaque paume" },
        { name: "Dos des mains", duration: 60, type: 'work', instruction: "Faites des cercles avec vos pouces sur le dos des mains" },
        { name: "Finalisation", duration: 15, type: 'rest', instruction: "Terminez en secouant doucement les mains" }
      ];
    }
    
    if (title === "Respiration du Ventre") {
      return [
        { name: "Position", duration: 15, type: 'preparation', instruction: "Posez une main sur votre ventre" },
        { name: "Respiration abdominale", duration: 225, type: 'work', instruction: "Inspirez lentement en gonflant le ventre comme un ballon, expirez doucement en rentrant le ventre. Répétez 10 fois à votre rythme." }
      ];
    }
    
    if (title === "Visualisation du Lieu Paisible") {
      return [
        { name: "Préparation", duration: 30, type: 'preparation', instruction: "Fermez les yeux et respirez calmement" },
        { name: "Visualisation", duration: 180, type: 'work', instruction: "Imaginez un lieu où vous vous sentez bien (plage, jardin, montagne). Visualisez les couleurs, entendez les sons." },
        { name: "Immersion", duration: 150, type: 'work', instruction: "Ressentez la température, les odeurs. Restez dans ce lieu paisible." }
      ];
    }
    
    if (title === "Marche Consciente Intérieure") {
      return [
        { name: "Ancrage", duration: 30, type: 'preparation', instruction: "Debout, sentez vos pieds en contact avec le sol" },
        { name: "3 pas conscients", duration: 90, type: 'work', instruction: "Faites 3 pas très lentement, concentrez-vous sur le mouvement de chaque pied" },
        { name: "Transfert de poids", duration: 60, type: 'work', instruction: "Sentez le transfert du poids d'un pied à l'autre" },
        { name: "Respiration finale", duration: 60, type: 'rest', instruction: "Arrêtez-vous et respirez profondément" }
      ];
    }
    
    if (title === "Gratitude Express") {
      return [
        { name: "Gratitude Express", duration: 120, type: 'work', instruction: "Pensez à une chose pour laquelle vous êtes reconnaissant aujourd'hui. Ressentez cette gratitude dans votre cœur, souriez intérieurement et remerciez mentalement votre corps." }
      ];
    }
    
    if (title === "Relaxation Express") {
      return [
        { name: "Épaules", duration: 30, type: 'work', instruction: "Haussez les épaules vers les oreilles, tenez 3 secondes, relâchez" },
        { name: "Yeux", duration: 30, type: 'work', instruction: "Fermez fort les yeux, tenez 3 secondes, relâchez" },
        { name: "Poings", duration: 30, type: 'work', instruction: "Serrez les poings, tenez 3 secondes, relâchez" },
        { name: "Ventre", duration: 30, type: 'work', instruction: "Contractez les muscles du ventre, tenez 3 secondes, relâchez" },
        { name: "Respiration finale", duration: 60, type: 'rest', instruction: "Respirez profondément et sentez la détente" }
      ];
    }
    
    if (title === "Respiration Apaisante 2-4") {
      return [
        { name: "Respiration 2-4", duration: 180, type: 'work', instruction: "Inspirez calmement en comptant jusqu'à 2, expirez lentement en comptant jusqu'à 4. Répétez ce rythme 2-4 sans forcer, concentrez-vous sur l'expiration plus longue." }
      ];
    }
    
    if (title === "Méditation du Thé/Tisane") {
      return [
        { name: "Préparation", duration: 60, type: 'preparation', instruction: "Préparez votre thé ou tisane avec attention. Observez la couleur, sentez l'arôme." },
        { name: "Première gorgée", duration: 30, type: 'work', instruction: "Prenez la première gorgée lentement, ressentez la chaleur et le goût" },
        { name: "Dégustation consciente", duration: 210, type: 'work', instruction: "Buvez en pleine conscience, gorgée par gorgée, savourez chaque instant" }
      ];
    }
    
    // Pour les autres exercices de détente, analyse générique
    return analyzeGenericExercise(steps, duration);
  };

  // Gestion du timer
  useEffect(() => {
    const analyzedPhases = exerciseType === 'sport' 
      ? analyzeExerciseSpecs(exerciseSteps, totalDuration, exerciseTitle)
      : analyzeDetenteSpecs(exerciseSteps, totalDuration, exerciseTitle);
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Phase terminée
            if (currentPhaseIndex < phases.length - 1) {
              // Passer à la phase suivante
              const nextPhase = phases[currentPhaseIndex + 1];
              setCurrentPhaseIndex(prev => prev + 1);
              return nextPhase.duration;
            } else {
              // Exercice terminé
              setIsRunning(false);
              onComplete?.();
              Alert.alert('Félicitations !', 'Exercice terminé !');
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, currentPhaseIndex, phases, onComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentPhaseIndex(0);
    if (phases.length > 0) {
      setTimeRemaining(phases[0].duration);
    }
  };

  const skipPhase = () => {
    if (currentPhaseIndex < phases.length - 1) {
      const nextPhase = phases[currentPhaseIndex + 1];
      setCurrentPhaseIndex(prev => prev + 1);
      setTimeRemaining(nextPhase.duration);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = (type: string): string => {
    switch (type) {
      case 'work': return exerciseType === 'sport' ? Colors.sport : Colors.relaxation;
      case 'rest': return Colors.success;
      case 'preparation': return Colors.warning;
      default: return Colors.agpBlue;
    }
  };

  if (!isInitialized || phases.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Analyse de l'exercice...</Text>
      </View>
    );
  }

  const currentPhase = phases[currentPhaseIndex];

  return (
    <View style={styles.container}>
      {/* Titre de l'exercice */}
      <Text style={styles.exerciseTitle}>Chrono Adaptatif</Text>
      
      {/* Phase actuelle */}
      <View style={[styles.phaseContainer, { backgroundColor: getPhaseColor(currentPhase.type) }]}>
        <Text style={styles.phaseText}>{currentPhase.name}</Text>
        <Text style={styles.phaseType}>
          {currentPhase.type === 'work' ? '💪 Effort' : 
           currentPhase.type === 'rest' ? '😌 Repos' : '🔥 Préparation'}
        </Text>
      </View>

      {/* Chrono principal */}
      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, { color: getPhaseColor(currentPhase.type) }]}>
          {formatTime(timeRemaining)}
        </Text>
      </View>

      {/* Progression */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Phase {currentPhaseIndex + 1} sur {phases.length}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${((currentPhaseIndex + 1) / phases.length) * 100}%`,
                backgroundColor: getPhaseColor(currentPhase.type)
              }
            ]} 
          />
        </View>
      </View>

      {/* Contrôles */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={resetTimer}>
          <RotateCcw size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.playButton, { backgroundColor: getPhaseColor(currentPhase.type) }]} 
          onPress={toggleTimer}
        >
          {isRunning ? (
            <Pause size={32} color={Colors.textLight} />
          ) : (
            <Play size={32} color={Colors.textLight} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={skipPhase}>
          <SkipForward size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Instruction actuelle */}
      {currentPhase.instruction && (
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>Instruction :</Text>
          <Text style={styles.instructionText}>{currentPhase.instruction}</Text>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    margin: 20,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
  exerciseTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  phaseContainer: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  phaseText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 4,
  },
  phaseType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginBottom: 24,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  instructionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  nextPhasesContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
});