import { Tabs } from 'expo-router';
import { Chrome as Home, Calendar, ChartBar as BarChart3, User } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.agpBlue,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          height: 70,
          paddingTop: 6,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Poppins-SemiBold',
        },
      }}
    >
      {/* Onglets visibles */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="programme"
        options={{
          title: 'Programme',
          tabBarIcon: ({ size, color }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="suivi"
        options={{
          title: 'Suivi',
          tabBarIcon: ({ size, color }) => <BarChart3 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />

      {/* Routes masquées du TabBar (restent navigables via router.push('/...')) */}
      <Tabs.Screen name="recettes" options={{ href: null, tabBarButton: () => null }} />
      <Tabs.Screen name="sport"    options={{ href: null, tabBarButton: () => null }} />
      <Tabs.Screen name="detente"  options={{ href: null, tabBarButton: () => null }} />
    </Tabs>
  );
}
