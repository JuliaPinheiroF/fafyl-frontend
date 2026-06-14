import React, { useRef, useState, useEffect, useCallback } from 'react';

function useScreenDimensions() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
  return width;
}

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

const CARD_MARGIN = 6;

function Card({ item, index, scrollLeft, cardWidth, containerWidth, onViewCollege }: { item: College; index: number; scrollLeft: number; cardWidth: number; containerWidth: number; onViewCollege?: (id: string) => void }) {
  const center = index * (cardWidth + CARD_MARGIN * 2) + cardWidth / 2;
  const viewCenter = scrollLeft + containerWidth / 2;
  const distance = Math.abs(viewCenter - center);
  const scale = Math.max(0.8, 1 - (distance / containerWidth) * 0.2);
  const opacity = Math.max(0.4, 1 - (distance / containerWidth) * 0.6);

  return (
    <div
      style={{
        width: cardWidth,
        margin: '0 6px',
        flexShrink: 0,
        transform: `scale(${scale})`,
        opacity,
        transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
      }}
    >
      <div
        style={{
          borderRadius: 25,
          overflow: 'hidden',
          backgroundColor: '#010080',
        }}
      >
        <img
          src={item.image}
          alt={item.name}
          style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }}
        />
        <div style={{ padding: 16, textAlign: 'center' as const }}>
          <p style={{ fontSize: 20, fontWeight: 'bold', color: '#FFD700', margin: 0 }}>{item.name}</p>
          <p style={{ fontSize: 13, color: '#fff', textAlign: 'center', margin: '8px 0' }}>{item.description}</p>
          <button
            onClick={() => onViewCollege?.(item.id)}
            style={{
              backgroundColor: '#FFD700',
              borderRadius: 20,
              padding: '0 20px',
              height: 36,
              border: 'none',
              fontWeight: 'bold',
              color: '#000',
              cursor: 'pointer',
            }}
          >
            Ver mais
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Corrossel({ onViewCollege }: { onViewCollege?: (id: string) => void }) {
  const screenWidth = useScreenDimensions();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const pauseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const REPEAT_COUNT = 10;
  const DATA = Array(REPEAT_COUNT).fill(MOCK_COLLEGES).flat();
  const cardWidth = screenWidth * 0.7;
  const itemWidth = cardWidth + CARD_MARGIN * 2;
  const middleIndex = Math.floor(DATA.length / 2);
  const middleOffset = middleIndex * itemWidth;
  const oneLoopWidth = MOCK_COLLEGES.length * itemWidth;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = middleOffset;
      setScrollLeft(middleOffset);
    }
  }, []);

  useEffect(() => {
    if (isInteracting) return;
    const step = 0.8 * (screenWidth / 390);
    const id = setInterval(() => {
      if (scrollRef.current) {
        const next = scrollRef.current.scrollLeft + step;
        scrollRef.current.scrollLeft = next;
        if (next >= middleOffset + oneLoopWidth) {
          scrollRef.current.scrollLeft = middleOffset;
        }
      }
    }, 20);
    return () => clearInterval(id);
  }, [isInteracting, screenWidth, middleOffset, oneLoopWidth]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  }, []);

  const handleInteractionStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
    if (pauseRef.current) clearTimeout(pauseRef.current);
    setIsInteracting(true);
  };

  const handleInteractionEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
    pauseRef.current = setTimeout(() => setIsInteracting(false), 3000);
  };

  return (
    <div style={{ width: '100%', height: cardWidth * 0.85 + 40, position: 'relative' }}>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        style={{
          display: 'flex',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
        {DATA.map((item, index) => (
          <div key={index}>
            <Card
              item={item}
              index={index}
              scrollLeft={scrollLeft}
              cardWidth={cardWidth}
              containerWidth={screenWidth}
              onViewCollege={onViewCollege}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
