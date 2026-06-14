import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import { cn } from '@/lib/utils';

interface AppBackgroundProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Background({
  title,
  showBackButton = false,
  onBackPress,
  headerAction,
  children,
  className,
}: AppBackgroundProps) {
  const navigate = useNavigate();
  const handleBack = onBackPress ?? (() => navigate(-1));

  return (
    <div className={cn("min-h-screen bg-background flex flex-col bg-radial-gradient", className)}>
      {title && (
        <header className="sticky top-0 z-20 glass-dark shadow-[var(--shadow-header)] px-4 h-14 flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="flex items-center justify-center p-1 cursor-pointer bg-transparent border-none text-primary-foreground/80 hover:text-primary-foreground active:scale-90 transition-all"
            >
              <IoChevronBack size={24} />
            </button>
          )}
          {!showBackButton && title && (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl gold-gradient flex items-center justify-center shadow-[var(--shadow-glow-gold)]">
                  <span className="text-primary text-sm font-black">F</span>
                </div>
                <h1 className="text-lg font-semibold text-primary-foreground m-0 tracking-tight">
                  {title}
                </h1>
              </div>
              {headerAction && (
                <div className="flex items-center">{headerAction}</div>
              )}
            </div>
          )}
          {showBackButton && title && (
            <h1 className="text-lg font-semibold text-primary-foreground m-0">
              {title}
            </h1>
          )}
        </header>
      )}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
