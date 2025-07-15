'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

const DualTooltipProvider = TooltipPrimitive.Provider;

interface DualTooltipProps {
  children: React.ReactNode;
  titleContent: React.ReactNode;
  descriptionContent: React.ReactNode;
  titleSide?: 'top' | 'right' | 'bottom' | 'left';
  descriptionSide?: 'top' | 'right' | 'bottom' | 'left';
  titleClassName?: string;
  descriptionClassName?: string;
  titleSideOffset?: number;
  descriptionSideOffset?: number;
  showDescriptionIndicator?: boolean;
  descriptionIndicatorClassName?: string;
}

const DualTooltip = ({
  children,
  titleContent,
  descriptionContent,
  titleSide = 'top',
  descriptionSide = 'bottom',
  titleClassName,
  descriptionClassName,
  titleSideOffset = 8,
  descriptionSideOffset = 5,
  showDescriptionIndicator = true,
  descriptionIndicatorClassName,
}: DualTooltipProps) => {
  // Generate a unique ID for this tooltip instance
  const uniqueId = React.useId();
  const [showDescTooltip, setShowDescTooltip] = React.useState(false);

  // When showDescriptionIndicator is false, we want to show both tooltips on hover
  const handleMouseEnter = React.useCallback(() => {
    if (!showDescriptionIndicator) {
      setShowDescTooltip(true);
    }
  }, [showDescriptionIndicator]);

  const handleMouseLeave = React.useCallback(() => {
    if (!showDescriptionIndicator) {
      setShowDescTooltip(false);
    }
  }, [showDescriptionIndicator]);

  return (
    <DualTooltipProvider>
      <div
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Title tooltip */}
        <TooltipPrimitive.Root
          open={showDescriptionIndicator ? undefined : showDescTooltip}
        >
          <TooltipPrimitive.Trigger asChild>
            <div className="w-full h-full">{children}</div>
          </TooltipPrimitive.Trigger>
          <TooltipPrimitive.Content
            side={titleSide}
            sideOffset={titleSideOffset}
            className={cn(
              'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-w-[300px]',
              titleClassName,
            )}
          >
            {titleContent}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Root>

        {/* Description tooltip */}
        <TooltipPrimitive.Root
          open={showDescriptionIndicator ? undefined : showDescTooltip}
        >
          <TooltipPrimitive.Trigger asChild>
            {showDescriptionIndicator ? (
              <div
                className={cn(
                  'absolute -bottom-1 right-0 w-5 h-5 bg-gray-800/80 dark:bg-gray-200/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-help z-20',
                  descriptionIndicatorClassName,
                )}
                id={`desc-trigger-${uniqueId}`}
              >
                <span className="text-gray-200 dark:text-gray-800 text-xs">
                  i
                </span>
              </div>
            ) : (
              <div
                className="absolute inset-0 cursor-help z-10 opacity-0"
                id={`desc-trigger-${uniqueId}`}
                aria-describedby={`desc-content-${uniqueId}`}
              />
            )}
          </TooltipPrimitive.Trigger>
          <TooltipPrimitive.Content
            side={descriptionSide}
            sideOffset={descriptionSideOffset}
            className={cn(
              'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-w-[250px]',
              descriptionClassName,
            )}
            id={`desc-content-${uniqueId}`}
          >
            {descriptionContent}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Root>
      </div>
    </DualTooltipProvider>
  );
};

export { DualTooltip, DualTooltipProvider };
