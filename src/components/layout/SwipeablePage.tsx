import { router, usePathname } from 'expo-router';
import React, { useRef } from 'react';
import { PanResponder, StyleSheet, TouchableOpacity, View } from 'react-native';

const SWIPE_ORDER = ['/home', '/quiz-info', '/busca'];
const SWIPE_THRESHOLD = 80;
const TAB_BAR_HEIGHT = 90;

export default function SwipeablePage({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentIndex = SWIPE_ORDER.indexOf(pathname);

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 20 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderRelease: (_, g) => {
        const index = currentIndexRef.current;
        if (index === -1) return;
        const { dx, dy } = g;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
          if (dx < 0 && index < SWIPE_ORDER.length - 1) {
            router.navigate(SWIPE_ORDER[index + 1] as any);
          } else if (dx > 0 && index > 0) {
            router.navigate(SWIPE_ORDER[index - 1] as any);
          }
        }
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {children}
      <View style={styles.dots} pointerEvents="box-none">
        {SWIPE_ORDER.map((page, i) => (
          <TouchableOpacity
            key={page}
            onPress={() => router.navigate(page as any)}
            style={[styles.dot, i === currentIndex ? styles.dotActive : styles.dotInactive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dots: {
    position: 'absolute',
    bottom: TAB_BAR_HEIGHT + 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 20,
    backgroundColor: '#010080',
  },
  dotInactive: {
    width: 6,
    backgroundColor: 'rgba(1, 0, 128, 0.2)',
  },
});