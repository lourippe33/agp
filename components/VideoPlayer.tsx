import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail: string;
  title?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  style?: any;
}

const { width } = Dimensions.get('window');

export default function VideoPlayer({
  videoUrl,
  thumbnail,
  title,
  autoPlay = false,
  showControls = true,
  style,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showThumbnail, setShowThumbnail] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const videoRef = useRef<any>(null);

  // Pour le web, nous utiliserons une iframe YouTube ou un élément video HTML5
  const isYouTubeUrl = videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));

  const handlePlayPause = () => {
    if (showThumbnail) {
      setShowThumbnail(false);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&mute=${isMuted ? 1 : 0}` : url;
  };

  if (showThumbnail) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayPause}
              activeOpacity={0.8}
            >
              <Play size={32} color={Colors.textLight} fill={Colors.textLight} />
            </TouchableOpacity>
          </View>
          {title && (
            <View style={styles.titleOverlay}>
              <Text style={styles.videoTitle}>{title}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.videoContainer}>
        {isYouTubeUrl ? (
          // Pour les vidéos YouTube
          <iframe
            src={getYouTubeEmbedUrl(videoUrl)}
            style={styles.iframe}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          // Pour les vidéos MP4 locales ou externes
          <video
            ref={videoRef}
            src={videoUrl}
            style={styles.video}
            autoPlay={autoPlay}
            muted={isMuted}
            loop={false}
            controls={false}
            onTimeUpdate={(e) => setCurrentTime((e.target as any).currentTime)}
            onLoadedMetadata={(e) => setDuration((e.target as any).duration)}
          />
        )}

        {showControls && !isYouTubeUrl && (
          <View style={styles.controls}>
            <View style={styles.topControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handlePlayPause}
                activeOpacity={0.8}
              >
                {isPlaying ? (
                  <Pause size={24} color={Colors.textLight} />
                ) : (
                  <Play size={24} color={Colors.textLight} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleMute}
                activeOpacity={0.8}
              >
                {isMuted ? (
                  <VolumeX size={20} color={Colors.textLight} />
                ) : (
                  <Volume2 size={20} color={Colors.textLight} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleRestart}
                activeOpacity={0.8}
              >
                <RotateCcw size={20} color={Colors.textLight} />
              </TouchableOpacity>
            </View>

            <View style={styles.bottomControls}>
              <Text style={styles.timeText}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }
                  ]} 
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  thumbnailContainer: {
    position: 'relative',
    aspectRatio: 16 / 9,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 40,
    padding: 16,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
  },
  videoTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  videoContainer: {
    position: 'relative',
    aspectRatio: 16 / 9,
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  controlButton: {
    padding: 8,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textLight,
    minWidth: 80,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.agpGreen,
    borderRadius: 2,
  },
});