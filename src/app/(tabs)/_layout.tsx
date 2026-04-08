import { Ionicons } from '@expo/vector-icons';
import { Tabs, Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function BuscaTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFDE59',
        tabBarInactiveTintColor: '#FFF',
        tabBarStyle: {
          backgroundColor: '#010080',
          height: 90,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderTopWidth: 0,
          position: 'absolute',
          elevation: 0,
          paddingTop: 15,
          paddingBottom: Platform.OS === 'ios' ? 30 : 15,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="bulb-outline" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="busca"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="search" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sobre"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="people" size={30} color={color} />,
        }}
      />
    </Tabs>
  );
}