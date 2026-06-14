import React, { useRef, useEffect } from 'react';

type WidthValue = number | '100%' | 'auto' | string;

interface SkeletonProps {
  width?: WidthValue;
  height?: number;
  borderRadius?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  children,
}: SkeletonProps) {
  const shimmerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shimmerRef.current) {
      shimmerRef.current.style.animation = 'shimmer 1.2s linear infinite';
    }
  }, []);

  const widthStyle = typeof width === 'string' && width.endsWith('%')
    ? { width: width as string }
    : { width: width as number };

  return (
    <div
      style={{
        backgroundColor: '#E0E0E0',
        position: 'relative',
        overflow: 'hidden',
        height,
        borderRadius,
        ...widthStyle,
        ...style,
      } as React.CSSProperties}
    >
      <div
        ref={shimmerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 150,
          backgroundColor: 'transparent',
          boxShadow: '0 0 10px 8px rgba(255,255,255,0.8)',
        }}
      />
      <style>{`@keyframes shimmer { from { transform: translateX(-150px); } to { transform: translateX(300px); } }`}</style>
      {children}
    </div>
  );
}

export function SkeletonCircle({ size = 50 }: { size?: number }) {
  return (
    <div
      style={{
        backgroundColor: '#E0E0E0',
        position: 'relative',
        overflow: 'hidden',
        width: size,
        height: size,
        borderRadius: size / 2,
      }}
    />
  );
}

export function SkeletonRow({ height = 20 }: { height?: number }) {
  return <Skeleton width="100%" height={height} borderRadius={4} />;
}
