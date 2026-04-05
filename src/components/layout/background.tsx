import { AlfaSlabOne_400Regular, useFonts } from '@expo-google-fonts/alfa-slab-one';
import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface AppBackgroundProps {
  title: string;
  showUserIcon?: boolean;
  onUserIconPress?: () => void;
  children: React.ReactNode;
}

export default function Background({ title, showUserIcon = false, onUserIconPress, children }: AppBackgroundProps) {
  const [fontsLoaded] = useFonts({ AlfaSlabOne_400Regular });
  if (!fontsLoaded) return null;

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {/* Header Fixo */}
        <View style={[styles.header, showUserIcon ? styles.headerSpaced : styles.headerCentered]}>
          <Text style={styles.title}>{title}</Text>
          {showUserIcon && (
            <TouchableOpacity onPress={onUserIconPress} style={styles.iconButton}>
              <Svg width={40} height={40} viewBox="0 0 16 16">
                <Path fill="white" d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                <Path fill="white" fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
              </Svg>            
            </TouchableOpacity>
          )}
        </View>

        
        <View style={styles.main}>
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#010080' },
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: {
    width: '100%',
    height: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpaced: { flexDirection: 'row', justifyContent: 'space-between' },
  headerCentered: { flexDirection: 'row', justifyContent: 'center' },
  title: {
    fontFamily: 'AlfaSlabOne_400Regular',
    fontSize: 45,
    color: '#ffde59',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  iconButton: { padding: 5 },
  main: { flex: 1 }, // REMOVIDO PADDING LATERAL DAQUI
});