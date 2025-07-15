export const Colors = {
  // Couleurs principales AGP basées sur le logo
  primary: '#4A90E2', // Bleu principal du logo
  secondary: '#7CB342', // Vert principal du logo
  accent: '#2E7D32', // Vert foncé pour les accents
  
  // Couleurs par moment de la journée - harmonisées avec le logo
  morning: '#FFD54F', // Jaune doux pour le matin
  noon: '#7CB342', // Vert du logo pour midi
  snack: '#FF9800', // Orange pour le goûter
  evening: '#4A90E2', // Bleu du logo pour le soir
  relaxation: '#FF6B6B', // Rose pour la détente
  sport: '#FF5722', // Orange-rouge pour le sport
  
  // Couleurs système
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#2C3E50', // Bleu-gris foncé plus doux
  textSecondary: '#7F8C8D',
  textLight: '#FFFFFF',
  border: '#E8F4FD', // Bleu très clair
  shadow: '#000000',
  
  // États
  success: '#7CB342', // Vert du logo
  warning: '#FF9800',
  error: '#E74C3C',
  info: '#4A90E2', // Bleu du logo
  
  // Gradients harmonisés avec le logo
  gradientMorning: ['#FFD54F', '#FFF3C4'],
  gradientNoon: ['#7CB342', '#C8E6C9'],
  gradientSnack: ['#FF9800', '#FFE0B2'],
  gradientEvening: ['#4A90E2', '#E3F2FD'],
  gradientRelaxation: ['#FF6B6B', '#FFE0E6'],
  gradientSport: ['#FF5722', '#FFCCBC'],
  
  // Couleurs spécifiques AGP
  agpBlue: '#4A90E2', // Bleu principal du logo
  agpGreen: '#7CB342', // Vert principal du logo
  agpGreenDark: '#2E7D32', // Vert foncé du logo
  agpLightBlue: '#E3F2FD', // Bleu très clair
  agpLightGreen: '#F1F8E9', // Vert très clair
};

export const getMomentColor = (moment: string) => {
  switch (moment.toLowerCase()) {
    case 'matin':
      return Colors.morning;
    case 'midi':
      return Colors.agpGreen; // Utilise le vert du logo
    case 'gouter':
      return Colors.snack;
    case 'soir':
      return Colors.agpBlue; // Utilise le bleu du logo
    case 'detente':
      return Colors.relaxation;
    case 'sport':
      return Colors.sport;
    default:
      return Colors.primary;
  }
};

export const getMomentGradient = (moment: string) => {
  switch (moment.toLowerCase()) {
    case 'matin':
      return Colors.gradientMorning;
    case 'midi':
      return Colors.gradientNoon;
    case 'gouter':
      return Colors.gradientSnack;
    case 'soir':
      return Colors.gradientEvening;
    case 'detente':
      return Colors.gradientRelaxation;
    case 'sport':
      return Colors.gradientSport;
    default:
      return [Colors.agpBlue, Colors.agpGreen];
  }
};