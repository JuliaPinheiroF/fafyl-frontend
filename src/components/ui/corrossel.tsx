import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import Animated, {
  interpolate,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

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

// =========================
// Dados
// =========================
interface College {
  id: string;
  name: string;
  description: string;
  color: string;
  image: string;
}

const MOCK_COLLEGES: College[] = [
  { id: '1', name: 'FAFYL', description: 'Tecnologia e Inovação', color: '#010080', image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&q=80' },
  { id: '2', name: 'Tech College', description: 'Engenharia & Design', color: '#1a1a9e', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80' },
  { id: '3', name: 'Nova Academy', description: 'Ciências da Computação', color: '#3300cc', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c8f1?w=400&q=80' },
  { id: '4', name: 'Future School', description: 'Negócios Digitais', color: '#4d00ff', image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=400&q=80' },
  { id: '5', name: 'Smart College', description: 'Inteligência Artificial', color: '#6633ff', image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=400&q=80' },
];

// =========================
// Loop infinito
// =========================
const REPEAT_COUNT = 10;
const DATA = Array(REPEAT_COUNT).fill(MOCK_COLLEGES).flat();

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// =========================
// Card
// =========================
function Card({ item, index, scrollX, cardWidth, itemWidth, screenWidth }: any) {
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
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.desc}>{item.description}</Text>
          <TouchableOpacity style={styles.button}>
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

  const cardWidth = screenWidth * 0.7;
  const spacing = 12;
  const itemWidth = cardWidth + spacing;

  const middleIndex = Math.floor(DATA.length / 2);
  const middleOffset = middleIndex * itemWidth;

  const scrollX = useSharedValue(0);
  const autoScroll = useSharedValue(middleOffset);
  const isUserInteracting = useSharedValue(false);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onBeginDrag: () => {
      isUserInteracting.value = true;
    },
    onEndDrag: () => {
      isUserInteracting.value = false;
    },
    onMomentumEnd: () => {
      isUserInteracting.value = false;
    },
  });

  useDerivedValue(() => {
    if (!isUserInteracting.value) {
      autoScroll.value += 0.6;

      scrollTo(flatListRef, autoScroll.value, 0, false);

      if (autoScroll.value >= middleOffset + MOCK_COLLEGES.length * itemWidth) {
        autoScroll.value = middleOffset;
        scrollTo(flatListRef, autoScroll.value, 0, false);
      }
    }
  });

  useEffect(() => {
    setTimeout(() => {
      scrollTo(flatListRef, middleOffset, 0, false);
    }, 100);
  }, []);

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
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: (screenWidth - cardWidth) / 2,
        }}
        onScroll={onScroll}
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
