import { Tabs } from 'expo-router';
import { Chrome as Home, Calendar, ChartBar as BarChart3, User, Users } from 'lucide-react-native';
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
        tabBarHideOnKeyboard: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          height: 70,
          paddingTop: 6,
          paddingBottom: 10,
          elevation: 8,
          shadowColor: Colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          borderTopWidth: 1,
          overflow: 'visible',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          lineHeight: 13,
          textAlign: 'center',
          fontFamily: 'Poppins-SemiBold',
          marginTop: 2,
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginBottom: 3,
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="programme"
        options={{
          title: 'Programme',
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="suivi"
        options={{
          title: 'Suivi',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}