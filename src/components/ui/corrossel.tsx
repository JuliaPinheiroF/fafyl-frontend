import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { router } from 'expo-router';

import Animated, {
  interpolate,
  runOnJS,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { getAllColleges } from '@/services/collegeService';

const { width } = Dimensions.get('window');


function useScreenDimensions() {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => sub?.remove();
  }, []);

  return dimensions;
}

interface College {
  id: string;
  name: string;
  description: string;
  color: string;
  image: string;
}

const FEATURED_IDS = [1, 19, 20, 74, 86];
const REPEAT_COUNT = 10;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// =========================
// Card
// =========================
function Card({ item, index, scrollX, cardWidth, itemWidth, screenWidth, onViewCollege }: any) {
  const animatedStyle = useAnimatedStyle(() => {
    const center = index * itemWidth;
    const distance = Math.abs(scrollX.value - center);

    const scale = interpolate(distance, [0, screenWidth], [1, 0.8]);
    const opacity = interpolate(distance, [0, screenWidth], [1, 0.4]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[{ width: cardWidth, marginHorizontal: 6 }, animatedStyle]}>
      <View style={styles.card}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} />
        ) : (
          <View style={styles.imageFallback}>
            <Text style={styles.imageFallbackLetter}>{item.name.charAt(0)}</Text>
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.desc}>{item.description}</Text>
          <TouchableOpacity style={styles.button} onPress={() => onViewCollege(item.id)}>
            <Text style={styles.buttonText}>Ver mais</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

export default function Corrossel() {
  const flatListRef = useAnimatedRef<FlatList>();
  const { width: screenWidth } = useScreenDimensions();
  const [items, setItems] = useState<College[]>([]);

  useEffect(() => {
    getAllColleges().then((cols) => {
      const featured = FEATURED_IDS
        .map((id) => cols.find((c) => c.id === id))
        .filter((c): c is NonNullable<typeof c> => !!c);
      const selected = featured.length >= 3 ? featured : cols.slice(0, 5);
      setItems(
        selected.map((c) => ({
          id: String(c.id),
          name: c.name,
          description: c.description.length > 50 ? c.description.slice(0, 50) + '…' : c.description,
          color: '#010080',
          image: c.image || '',
        }))
      );
    });
  }, []);

  const DATA = items.length > 0 ? Array(REPEAT_COUNT).fill(items).flat() : [];

  const cardWidth = screenWidth * 0.7;
  const spacing = 12;
  const itemWidth = cardWidth + spacing;

  const middleIndex = Math.floor(DATA.length / 2);
  const middleOffset = middleIndex * itemWidth;

  const scrollX = useSharedValue(0);
  const autoScroll = useSharedValue(middleOffset);
  const isUserInteracting = useSharedValue(false);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPause = () => {
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
  };

  const scheduleResume = () => {
    clearPause();
    pauseTimer.current = setTimeout(() => {
      isUserInteracting.value = false;
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (pauseTimer.current) clearTimeout(pauseTimer.current);
    };
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onBeginDrag: () => {
      isUserInteracting.value = true;
      runOnJS(clearPause)();
    },
  });

  useDerivedValue(() => {
    if (!isUserInteracting.value) {
      autoScroll.value += 0.2 * (screenWidth / 390);

      scrollTo(flatListRef, autoScroll.value, 0, false);

      if (items.length > 0 && autoScroll.value >= middleOffset + items.length * itemWidth) {
        autoScroll.value = middleOffset;
        scrollTo(flatListRef, autoScroll.value, 0, false);
      }
    }
  });

  useEffect(() => {
    if (DATA.length > 0) {
      setTimeout(() => {
        scrollTo(flatListRef, middleOffset, 0, false);
      }, 100);
    }
  }, [DATA.length]);

  if (items.length === 0 || DATA.length === 0) {
    return <View style={[styles.container, { height: cardWidth * 0.85 + 40 }]} />;
  }

  return (
    <View style={[styles.container, { height: cardWidth * 0.85 + 40 }]}>
      <AnimatedFlatList
        ref={flatListRef}
        data={DATA}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Card
            item={item}
            index={index}
            scrollX={scrollX}
            cardWidth={cardWidth}
            itemWidth={itemWidth}
            screenWidth={screenWidth}
            onViewCollege={(id: string) => router.push(`/busca/${id}/faculdade` as any)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onScrollEndDrag={scheduleResume}
        onMomentumScrollEnd={scheduleResume}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={itemWidth}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  card: {
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#010080',
  },
  image: {
    width: '100%',
    height: 100,
  },
  imageFallback: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#010080',
  },
  imageFallbackLetter: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    opacity: 0.6,
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  desc: {
    fontSize: 13,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#FFD700',
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 36,
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000',
  },
});
