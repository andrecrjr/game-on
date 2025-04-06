'use client';

import { IAchievementsUser } from '@/types/steam';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
    indexGame: number;
    game: IAchievementsUser;
};

// Memoized individual achievement item component
const AchievementItem = React.memo(({ 
  achievement 
}: { 
  achievement: IAchievementsUser['achievements'][0]
}) => {
  const isAchieved = achievement.achieved === 1;
  
  return (
    <div className="flex-[0_0_100px] mx-2 first:ml-12 last:mr-12">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative transition-all duration-200 hover:scale-105">
              <img 
                src={isAchieved ? achievement.icon : achievement.icongray} 
                className={`w-full h-auto rounded-md ${!isAchieved ? 'grayscale contrast-50' : 'contrast-100'}`} 
                width="80" 
                height="80" 
                alt={achievement.name}
                loading="lazy"
              />
              {isAchieved && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[250px]">
            <div className="p-3">
              <p className={`text-center font-bold pb-2 ${isAchieved ? 'text-green-500' : 'text-gray-400'}`}>
                {isAchieved ? 'Unlocked' : 'Locked'}
              </p>
              <h4 className="font-bold text-sm mb-1">{achievement.displayName}</h4>
              <p className="text-sm">{achievement.description}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});

AchievementItem.displayName = 'AchievementItem';

// Carousel navigation button component
const CarouselButton = React.memo(({ 
  direction, 
  onClick, 
  enabled 
}: { 
  direction: 'left' | 'right'; 
  onClick: () => void; 
  enabled: boolean 
}) => {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  const position = direction === 'left' ? 'left-0' : 'right-0';
  
  return (
    <div className={`absolute top-0 bottom-0 ${position} flex items-center`}>
      <button 
        className="p-2 rounded-full bg-primary text-white shadow-md hover:bg-primary/90 mx-2 z-20 transition-opacity"
        onClick={onClick}
        disabled={!enabled}
        aria-label={`${direction === 'left' ? 'Previous' : 'Next'} achievements`}
        style={{ opacity: enabled ? 1 : 0.5 }}
      >
        <Icon size={24} />
      </button>
    </div>
  );
});

CarouselButton.displayName = 'CarouselButton';

export const AchievementTableLine = React.memo(({ game }: Props) => {
  // Use specific string literals instead of generic strings for Embla options
  const carouselOptions = useMemo(() => ({
    align: 'start' as const,
    containScroll: 'trimSnaps' as const,
    dragFree: true,
  }), []);
  
  const [emblaRef, emblaApi] = useEmblaCarousel(carouselOptions);
  
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  // Use useCallback to prevent recreation of these functions on every render
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    // Use requestAnimationFrame instead of setTimeout for better performance
    const timeoutId = window.setTimeout(() => {
      requestAnimationFrame(onSelect);
    }, 100);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
      clearTimeout(timeoutId);
    };
  }, [emblaApi, onSelect]);

  // Memoize the achievements array to prevent unnecessary re-renders
  const achievements = useMemo(() => game.achievements, [game.achievements]);

  return (
    <div className="relative w-full h-[140px] overflow-hidden">
      <CarouselButton direction="left" onClick={scrollPrev} enabled={prevBtnEnabled} />
      
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full items-center">
          {achievements.map((achievement) => (
            <AchievementItem 
              key={achievement.displayName} 
              achievement={achievement} 
            />
          ))}
        </div>
      </div>
      
      <CarouselButton direction="right" onClick={scrollNext} enabled={nextBtnEnabled} />
    </div>
  );
});

AchievementTableLine.displayName = 'AchievementTableLine';
