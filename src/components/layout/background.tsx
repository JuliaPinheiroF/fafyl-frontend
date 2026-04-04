import { AlfaSlabOne_400Regular, useFonts } from '@expo-google-fonts/alfa-slab-one';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface AppBackgroundProps {
  title: string;
  showUserIcon?: boolean;
  onUserIconPress?: () => void;
  children: React.ReactNode;
}

export default function Background({
  title,
  showUserIcon = false,
  onUserIconPress,
  children,
}: AppBackgroundProps) {
  const [fontsLoaded] = useFonts({ AlfaSlabOne_400Regular });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={[styles.header, showUserIcon ? styles.headerSpaced : styles.headerCentered]}>
          <Text style={styles.title}>{title}</Text>
          {showUserIcon && (
            <TouchableOpacity onPress={onUserIconPress}>
            <Svg width={56} height={56} viewBox="0 0 16 16">
            <Path fill="white" d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
            <Path fill="white" fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
            </Svg>            
            </TouchableOpacity>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.main}>
          {children}
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#010080',
    width: '100%',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    width: '100%',
    height: 72,
    paddingHorizontal: 32,
    paddingTop: 24,
    alignItems: 'center',
  },
  headerSpaced: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerCentered: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'AlfaSlabOne_400Regular',
    fontSize: 56,
    color: '#ffde59',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    letterSpacing: 1,
  },
  main: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
});