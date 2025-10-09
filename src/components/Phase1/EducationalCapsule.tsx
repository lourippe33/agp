import { useState, useEffect } from 'react';
import { PlayCircle, BookOpen, Lightbulb, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { EducationalCapsule as CapsuleType } from '../../types/journal';

interface EducationalCapsuleProps {
  weekNumber: number;
}

export function EducationalCapsule({ weekNumber }: EducationalCapsuleProps) {
  const [capsule, setCapsule] = useState<CapsuleType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCapsule();
  }, [weekNumber]);

  const loadCapsule = async () => {
    setLoading(true);

    if (supabase) {
      const { data, error } = await supabase
        .from('educational_capsules')
        .select('*')
        .eq('week_number', weekNumber)
        .maybeSingle();

      if (data) {
        setCapsule(data);
        setLoading(false);
        return;
      }
    }

    const mockCapsule: CapsuleType = {
      id: `capsule-week-${weekNumber}`,
      day_number: weekNumber,
      phase: 1,
      title: 'Introduction à l\'AGP - Semaine 1',
      content_type: 'video',
      video_url: 'https://vimeo.com/922834231',
      description: 'Cette capsule vous introduit aux principes fondamentaux de l\'Approche Globale Progressive. Découvrez comment cette méthode va transformer votre relation avec votre corps et votre alimentation.',
      duration_minutes: 8,
      key_takeaway: 'L\'AGP est une approche holistique qui respecte votre corps et vos besoins individuels.',
      created_at: new Date().toISOString()
    };

    setCapsule(mockCapsule);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  if (!capsule) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-[#2B7BBE] to-[#5FA84D] rounded-2xl shadow-lg p-6 text-white">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-white bg-opacity-20 p-3 rounded-xl">
          <PlayCircle className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wide opacity-90">
              Capsule de la semaine {weekNumber}
            </span>
            <div className="flex items-center space-x-1 text-xs opacity-90">
              <Clock className="w-3 h-3" />
              <span>{capsule.duration_minutes} min</span>
            </div>
          </div>
          <h2 className="text-xl font-bold">{capsule.title}</h2>
        </div>
      </div>

      {capsule.video_url && (
        <a
          href={capsule.video_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 bg-black bg-opacity-20 rounded-xl overflow-hidden block group cursor-pointer hover:bg-opacity-30 transition-all"
          style={{ paddingTop: '56.25%', position: 'relative' }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/40 to-black/60 group-hover:from-black/30 group-hover:to-black/50 transition-all">
            <div className="text-center">
              <PlayCircle className="w-20 h-20 mx-auto mb-3 opacity-90 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium opacity-90">Cliquez pour regarder la vidéo</p>
            </div>
          </div>
        </a>
      )}

      <div className="bg-white bg-opacity-10 rounded-xl p-4 mb-4">
        <p className="text-white text-opacity-95 leading-relaxed">
          {capsule.description}
        </p>
      </div>

      {capsule.key_takeaway && (
        <div className="bg-white bg-opacity-20 rounded-xl p-4 flex items-start space-x-3">
          <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold mb-1">À retenir :</p>
            <p className="text-sm opacity-95">{capsule.key_takeaway}</p>
          </div>
        </div>
      )}

      {capsule.content_url && (
        <a
          href={capsule.content_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full bg-white text-[#2B7BBE] py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-opacity-90 transition-colors"
        >
          <BookOpen className="w-5 h-5" />
          <span>Lire l'article complet</span>
        </a>
      )}
    </div>
  );
}
