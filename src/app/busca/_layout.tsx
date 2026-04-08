import { Stack } from 'expo-router';

export default function BuscaLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#010080' },
      }}
    />
  );
}