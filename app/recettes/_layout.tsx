import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import PersistentTabBar from '@/components/PersistentTabBar';

export default function RecettesLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="matin" />
        <Stack.Screen name="midi" />
        <Stack.Screen name="gouter" />
        <Stack.Screen name="soir" />
      </Stack>
      <PersistentTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});