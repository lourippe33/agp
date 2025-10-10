import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Settings } from 'lucide-react';
import { HomeScreen } from './HomeScreen';
import { BottomNav } from './BottomNav';
import { RecipesSection } from '../Recipes/RecipesSection';
import { SportsSection } from '../Sports/SportsSection';
import { RelaxationSection } from '../Relaxation/RelaxationSection';
import { EmotionsSection } from '../Emotions/EmotionsSection';
import { AGPProgram } from '../AGP/AGPProgram';
import { TrackingView } from './TrackingView';
import { CommunityView } from '../Community/CommunityView';
import { ProfileEditor } from '../Profile/ProfileEditor';
import { NotificationsSettings } from '../Profile/NotificationsSettings';
import { GoalsManager } from '../Profile/GoalsManager';
import { ChronoBiologyView } from '../Neurotransmitters/ChronoBiologyView';
import { OnboardingQuestionnaire } from '../Onboarding/OnboardingQuestionnaire';
import { AdminSettings } from '../Profile/AdminSettings';
import { supabase } from '../../lib/supabase';

type View = 'home' | 'recipes' | 'sports' | 'relaxation' | 'emotions' | 'profile' | 'agp' | 'tracking' | 'community' | 'chronobiology';

export function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('home');
  const { user, logout } = useAuth();
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [weatherRefreshTrigger, setWeatherRefreshTrigger] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  const mockData = {
    currentWeight: 75,
    targetWeight: 70,
    weightChange7Days: -0.8,
    weightChange28Days: -2.5,
    energyLevel: 4,
    foodRegularity: 85,
    lastMeasurement: new Date().toLocaleDateString('fr-FR'),
  };

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfileData(data);
        setIsAdmin(data.role === 'admin');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {currentView === 'profile' && (
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-[#333333]">Mon Profil</h1>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </nav>
      )}

      <div className="flex-1 overflow-hidden">
        {currentView === 'home' && <HomeScreen onNavigate={setCurrentView} weatherRefreshTrigger={weatherRefreshTrigger} />}
        {currentView === 'agp' && <AGPProgram />}
        {currentView === 'tracking' && <TrackingView onDataSaved={() => setWeatherRefreshTrigger(prev => prev + 1)} />}
        {currentView === 'community' && <CommunityView />}

        {currentView === 'recipes' && (
          <div className="pb-24 overflow-y-auto">
            <div className="px-6 py-6">
              <RecipesSection />
            </div>
          </div>
        )}

        {currentView === 'sports' && (
          <div className="pb-24 overflow-y-auto">
            <div className="px-6 py-6">
              <SportsSection />
            </div>
          </div>
        )}

        {currentView === 'relaxation' && (
          <div className="pb-24 overflow-y-auto">
            <div className="px-6 py-6">
              <RelaxationSection />
            </div>
          </div>
        )}

        {currentView === 'emotions' && (
          <div className="pb-24 overflow-y-auto">
            <div className="px-6 py-6">
              <EmotionsSection />
            </div>
          </div>
        )}

        {currentView === 'chronobiology' && (
          <div className="pb-24 overflow-y-auto">
            <div className="px-6 py-6">
              <ChronoBiologyView />
            </div>
          </div>
        )}

        {currentView === 'profile' && (
          <div className="pb-24 overflow-y-auto px-6 py-6">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#2B7BBE] to-[#5FA84D] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {profileData?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#333333]">{profileData?.full_name || 'Utilisateur'}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                </div>

                {profileData && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    {profileData.height && (
                      <div>
                        <p className="text-sm text-gray-600">Taille</p>
                        <p className="font-semibold text-[#333333]">{profileData.height} cm</p>
                      </div>
                    )}
                    {profileData.target_weight && (
                      <div>
                        <p className="text-sm text-gray-600">Objectif</p>
                        <p className="font-semibold text-[#333333]">{profileData.target_weight} kg</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-[#333333] mb-4">Paramètres</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowProfileEditor(true)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Modifier le profil
                  </button>
                  <button
                    onClick={() => setShowNotifications(true)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Notifications
                  </button>
                  <button
                    onClick={() => setShowGoals(true)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Objectifs
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => setShowAdminSettings(true)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors text-[#2B7BBE] font-medium"
                    >
                      Administration
                    </button>
                  )}
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 rounded-lg transition-colors text-red-600 font-medium flex items-center space-x-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav activeView={currentView} onNavigate={setCurrentView} />

      {showProfileEditor && (
        <ProfileEditor
          onClose={() => setShowProfileEditor(false)}
          onSave={loadProfile}
          onOpenQuestionnaire={() => setShowQuestionnaire(true)}
        />
      )}

      {showQuestionnaire && (
        <OnboardingQuestionnaire
          onComplete={() => {
            setShowQuestionnaire(false);
            loadProfile();
          }}
        />
      )}

      {showNotifications && (
        <NotificationsSettings
          onClose={() => setShowNotifications(false)}
        />
      )}

      {showGoals && (
        <GoalsManager
          onClose={() => setShowGoals(false)}
        />
      )}

      {showAdminSettings && (
        <AdminSettings
          onClose={() => setShowAdminSettings(false)}
        />
      )}
    </div>
  );
}

