'use client';

import { IAchievementsUser } from '@/types/steam';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DualTooltip } from '@/components/ui/dual-tooltip';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  indexGame: number;
  game: IAchievementsUser;
};

// Memoized individual achievement item component
const AchievementItem = React.memo(
  ({
    achievement,
  }: {
    achievement: IAchievementsUser['achievements'][0];
  }) => {
    const isAchieved = achievement.achieved === 1;

    // Title tooltip content
    const titleContent = (
      <div className="p-2 relative">
        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-md ${isAchieved ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        <p
          className={`text-center font-bold pb-2 ${isAchieved ? 'text-green-500' : 'text-gray-400'} flex items-center justify-center`}
        >
          {isAchieved ? (
            <>
              <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </span>
              <span>Unlocked</span>
            </>
          ) : (
            <>
              <span className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </span>
              <span>Locked</span>
            </>
          )}
        </p>
        <h4 className="font-bold text-sm mb-2 border-b pb-2 border-gray-200 dark:border-gray-700">
          {achievement.displayName}
        </h4>
      </div>
    );

    // Description tooltip content
    const descriptionContent = (
      <div className="p-2 relative">
        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-md bg-blue-400`}></div>
        <p className="text-xs italic">{achievement.description}</p>
        {achievement.unlocktime > 0 && (
          <p className="text-xs mt-2 text-green-500 font-medium">
            Unlocked: {new Date(achievement.unlocktime * 1000).toLocaleDateString()}
          </p>
        )}
      </div>
    );

    return (
      <div className="flex-[0_0_100px] mx-3 first:ml-12 last:mr-12 relative z-10">
        <DualTooltip
          titleContent={titleContent}
          descriptionContent={descriptionContent}
          titleSide="top"
          descriptionSide="bottom"
          titleSideOffset={8}
          descriptionSideOffset={5}
          titleClassName="max-w-[300px] z-[100]"
          descriptionClassName="max-w-[250px] z-[100]"
          showDescriptionIndicator={false}
        >
          <div className="relative transition-all duration-300 hover:scale-110 hover:rotate-1 transform-gpu animate-fadeIn">
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
        </DualTooltip>
      </div>
    );
  },
);

AchievementItem.displayName = 'AchievementItem';

// Carousel navigation button component
const CarouselButton = React.memo(
  ({
    direction,
    onClick,
    enabled,
  }: {
    direction: 'left' | 'right';
    onClick: () => void;
    enabled: boolean;
  }) => {
    const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
    const position = direction === 'left' ? 'left-0' : 'right-0';

    return (
      <div className={`absolute top-0 bottom-0 ${position} flex items-center`}>
        <button
          className={`p-2 rounded-full shadow-md mx-2 z-20 transition-all duration-300 ${enabled ? 'bg-primary text-white hover:bg-primary/90 hover:scale-110' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}
          onClick={onClick}
          disabled={!enabled}
          aria-label={`${direction === 'left' ? 'Previous' : 'Next'} achievements`}
        >
          <Icon size={20} />
          <span className="sr-only">{direction === 'left' ? 'Previous' : 'Next'}</span>
        </button>
      </div>
    );
  },
);

CarouselButton.displayName = 'CarouselButton';

export const AchievementTableLine = React.memo(({ game }: Props) => {
  // Use specific string literals instead of generic strings for Embla options
  const carouselOptions = useMemo(
    () => ({
      align: 'start' as const,
      containScroll: 'trimSnaps' as const,
      dragFree: true,
    }),
    [],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(carouselOptions);

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  // Use useCallback to prevent recreation of these functions on every render
  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

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
    <div className="relative w-full overflow-visible flex-end">
      <CarouselButton
        direction="left"
        onClick={scrollPrev}
        enabled={prevBtnEnabled}
      />

      <div className="overflow-hidden h-full rounded-lg bg-background/50 backdrop-blur-sm shadow-inner" ref={emblaRef}>
        <div className="flex h-full items-center py-6 px-2">
          {achievements.map((achievement) => (
            <AchievementItem
              key={achievement.displayName}
              achievement={achievement}
            />
          ))}
        </div>
      </div>

      <CarouselButton
        direction="right"
        onClick={scrollNext}
        enabled={nextBtnEnabled}
      />
    </div>
  );
});

AchievementTableLine.displayName = 'AchievementTableLine';
