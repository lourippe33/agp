import { Home, Calendar, ClipboardList, User, Users, Shield } from 'lucide-react';

interface BottomNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
  isAdmin?: boolean;
}

export function BottomNav({ activeView, onNavigate, isAdmin = false }: BottomNavProps) {
  const baseNavItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'agp', label: 'Programme', icon: Calendar },
    { id: 'tracking', label: 'Suivi', icon: ClipboardList },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'community', label: 'Communauté', icon: Users },
  ];

  const adminNavItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'tracking', label: 'Suivi', icon: ClipboardList },
    { id: 'admin', label: 'Admin', icon: Shield },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  const navItems = isAdmin ? adminNavItems : baseNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-screen-xl mx-auto px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-[#2B7BBE]'
                    : 'text-gray-500 hover:text-[#5FA84D]'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : ''}`} />
                <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
