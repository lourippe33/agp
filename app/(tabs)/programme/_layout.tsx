import { Stack } from 'expo-router';

export default function ProgrammeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[day]" />
    </Stack>
  );
}