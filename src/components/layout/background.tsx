import { AlfaSlabOne_400Regular, useFonts } from '@expo-google-fonts/alfa-slab-one';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface AppBackgroundProps {
  title: string;
  titleSize?: number;
  centerTitle?: boolean;
  showUserIcon?: boolean;
  onUserIconPress?: () => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
  children: React.ReactNode;
}

export default function Background({ 
  title, 
  titleSize = 45,
  centerTitle = false,
  showUserIcon = false, 
  onUserIconPress, 
  showBackButton = false,
  onBackPress,
  children 
}: AppBackgroundProps) {
  const [fontsLoaded] = useFonts({ AlfaSlabOne_400Regular });
  if (!fontsLoaded) return null;

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        
        <View style={[
          styles.header, 
          showBackButton ? styles.headerLeft : (showUserIcon ? styles.headerSpaced : styles.headerLeft)
        ]}>
          
          {showBackButton && (
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
              <Ionicons name="chevron-back" size={28} color="#FFD700" />
            </TouchableOpacity>
          )}

          {!showBackButton && !showUserIcon && <View style={styles.placeholder} />}
          
          <View style={[ 
            styles.titleContainer, 
            centerTitle && styles.titleContainerCenter 
          ]}>
            <Text style={[
              styles.title, 
              showBackButton && !centerTitle && styles.titleWithBack,
              { fontSize: titleSize }
            ]}>
              {title}
            </Text>
          </View>
        
          {showUserIcon ? (
            <TouchableOpacity onPress={onUserIconPress} style={styles.iconButton}>
              <Svg width={40} height={40} viewBox="0 0 16 16">
                <Path fill="white" d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                <Path fill="white" fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
              </Svg>            
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
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
    paddingHorizontal: 40,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerSpaced: { justifyContent: 'space-between' },
  headerLeft: { justifyContent: 'flex-start' },
  headerCentered: { justifyContent: 'center' },
  backButton: { padding: 5, marginRight: 10 },
  placeholder: { width: 40 },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    pointerEvents: 'none',
  },
  title: {
    fontFamily: 'AlfaSlabOne_400Regular',
    fontSize: 45,
    color: '#ffde59',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  titleWithBack: {
    marginLeft: 10,
  },
  iconButton: { padding: 5 },
  main: { flex: 1 }, // REMOVIDO PADDING LATERAL DAQUI
  },

);