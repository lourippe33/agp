import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Heart, Brain, Zap, Play, Video } from 'lucide-react-native';
import { Exercise } from '@/types/Exercise';
import { Colors } from '@/constants/Colors';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
  onQuickStart?: () => void;
  onVideoPress?: () => void; // Nouvelle prop pour ouvrir les vidéos
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'respiration':
      return <Zap size={14} color={Colors.textSecondary} />;
    case 'meditation':
      return <Brain size={14} color={Colors.textSecondary} />;
    case 'coherence':
      return <Heart size={14} color={Colors.textSecondary} />;
    default:
      return <Heart size={14} color={Colors.textSecondary} />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'respiration':
      return '#4A90E2';
    case 'meditation':
      return '#7CB342';
    case 'coherence':
      return '#FF6B6B';
    case 'relaxation':
      return '#9C27B0';
    default:
      return Colors.primary;
  }
};

export default function ExerciseCard({ exercise, onPress, onQuickStart, onVideoPress }: ExerciseCardProps) {
  const typeColor = getTypeColor(exercise.type);
  const [cardAnimation] = React.useState(new Animated.Value(0));

  // Effet de clic avec animation
  const animateCardClick = () => {
    // Animation : 0 → 1 → 0 en 500ms
    Animated.sequence([
      Animated.timing(cardAnimation, {
        toValue: 1,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(cardAnimation, {
        toValue: 0,
        duration: 450,
        useNativeDriver: false,
      })
    ]).start();
  };

  const handlePress = () => {
    animateCardClick();
    onPress();
  };

  const handleQuickStart = (e: any) => {
    e.stopPropagation();
    if (onQuickStart) {
      onQuickStart();
    } else {
      onPress();
    }
  };

  const handleVideoPress = (e: any) => {
    e.stopPropagation();
    if (onVideoPress) {
      onVideoPress();
    }
  };

  // Interpolation de couleur pour l'effet de clic
  const animatedBackgroundColor = cardAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.surface, '#F5F5F5'] // Blanc → Gris clair
  });

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Animated.View style={[styles.card, { backgroundColor: animatedBackgroundColor }]}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: exercise.image }} style={styles.image} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          />
          <View style={styles.imageContent}>
            <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
              <Text style={styles.typeText}>{exercise.type}</Text>
            </View>
            
            {/* Indicateur vidéo */}
            {exercise.hasVideo && (
              <TouchableOpacity
                style={styles.videoIndicator}
                onPress={handleVideoPress}
                activeOpacity={0.8}
              >
                <Video size={16} color={Colors.textLight} />
              </TouchableOpacity>
            )}
          </View>

          {/* Bouton de démarrage rapide */}
          <TouchableOpacity
            style={[styles.quickStartButton, { backgroundColor: typeColor }]}
            onPress={handleQuickStart}
            activeOpacity={0.8}
          >
            <Play size={20} color={Colors.textLight} fill={Colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {exercise.titre}
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Clock size={14} color={Colors.textSecondary} />
              <Text style={styles.infoText}>
                {exercise.duree} min
              </Text>
            </View>
            <View style={styles.infoItem}>
              {getTypeIcon(exercise.type)}
              <Text style={styles.infoText}>
                {exercise.difficulte}
              </Text>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            {exercise.tags.slice(0, 2).map((tag, index) => (
              <View key={`${exercise.id}-${tag}-${index}`} style={[styles.tag, { borderColor: typeColor }]}>
                <Text style={[styles.tagText, { color: typeColor }]}>
                  {tag}
                </Text>
              </View>
            ))}
            {exercise.hasVideo && (
              <View style={[styles.tag, styles.videoTag]}>
                <Video size={10} color={Colors.agpBlue} />
                <Text style={[styles.tagText, { color: Colors.agpBlue }]}>
                  Vidéo
                </Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  imageContent: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: Colors.textLight,
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
  },
  videoIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 6,
  },
  quickStartButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  videoTag: {
    borderColor: Colors.agpBlue,
    backgroundColor: Colors.agpLightBlue,
  },
  tagText: {
    fontSize: 9,
    fontFamily: 'Inter-Medium',
  },
});