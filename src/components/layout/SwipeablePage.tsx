import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const SWIPE_ORDER = ['/home', '/quiz-info', '/busca', '/sobre'];
const SWIPE_THRESHOLD = 80;

export default function SwipeablePage({ children, className }: { children: React.ReactNode; className?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const currentIndex = SWIPE_ORDER.indexOf(location.pathname);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || currentIndex === -1) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0 && currentIndex < SWIPE_ORDER.length - 1) {
        navigate(SWIPE_ORDER[currentIndex + 1]);
      } else if (dx > 0 && currentIndex > 0) {
        navigate(SWIPE_ORDER[currentIndex - 1]);
      }
    }
    touchStart.current = null;
  };

  return (
    <div
      className={cn("flex-1 flex flex-col", className)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
      {currentIndex >= 0 && (
        <div className="flex justify-center gap-1.5 pb-2 pt-1 shrink-0">
          {SWIPE_ORDER.map((_, i) => (
            <div
              key={i}
              className={cn(
                "rounded-full transition-all duration-300",
                i === currentIndex
                  ? "w-5 h-1.5 bg-primary"
                  : "w-1.5 h-1.5 bg-muted-foreground/20"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
