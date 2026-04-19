import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type WidthValue = number | '100%' | 'auto' | string;

interface SkeletonProps {
  width?: WidthValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export default function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  children,
}: SkeletonProps) {
  const shimmer = useSharedValue(-1);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmer.value * 300 - 150 }],
  }));

  const widthStyle = typeof width === 'string' && width.endsWith('%')
    ? ({ width: width } as ViewStyle)
    : { width: width as number };

  return (
    <View
      style={[
        styles.base,
        { height, borderRadius, overflow: 'hidden' },
        widthStyle,
        style,
      ]}
    >
      <Animated.View style={[styles.shimmer, animatedStyle]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#E0E0E0',
    position: 'relative',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 150,
    backgroundColor: 'transparent',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
});

export function SkeletonCircle({ size = 50 }: { size?: number }) {
  return (
    <View
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  );
}

export function SkeletonRow({ height = 20 }: { height?: number }) {
  return <Skeleton width="100%" height={height} borderRadius={4} />;
}