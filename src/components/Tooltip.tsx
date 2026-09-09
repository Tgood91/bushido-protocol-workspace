import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  delay = 0,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      const updatePosition = () => {
        if (!tooltipRef.current) return;
        const rect = tooltipRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const padding = 12;
        
        let shift = 0;
        if (rect.left < padding) {
          shift = padding - rect.left;
        } else if (rect.right > viewportWidth - padding) {
          shift = viewportWidth - padding - rect.right;
        }
        
        if (Math.abs(shift) > 0.1) {
          setOffset(prev => prev + shift);
        }
      };

      // Run multiple times during entry to catch shifts from scale/opacity animations
      const interval = setInterval(updatePosition, 16); // ~60fps
      const timer = setTimeout(() => clearInterval(interval), 500); 
      
      window.addEventListener('resize', updatePosition);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
        window.removeEventListener('resize', updatePosition);
      };
    } else {
      setOffset(0);
    }
  }, [isVisible]);

  const positionClasses = {
    top: 'bottom-full left-1/2 mb-2',
    bottom: 'top-full left-1/2 mt-2',
    left: 'right-full top-1/2 mr-2',
    right: 'left-full top-1/2 ml-2',
  };

  const getX = () => {
    if (position === 'top' || position === 'bottom') return `calc(-50% + ${offset}px)`;
    return offset;
  };

  const getY = () => {
    if (position === 'left' || position === 'right') return '-50%';
    return 0;
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      onClick={() => {
        if ('ontouchstart' in window) {
          setIsVisible(!isVisible);
        }
      }}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.95, x: getX(), y: getY() }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: getX(),
              y: getY()
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, delay }}
            className={`absolute z-[100] px-3 py-1.5 text-[11px] font-medium text-[#141414]/90 dark:text-white/90 bg-white dark:bg-[#1A1A1A] border border-[#141414]/10 dark:border-white/10 rounded-xl shadow-2xl backdrop-blur-md whitespace-normal w-max max-w-[180px] text-center pointer-events-none ring-1 ring-[#141414]/5 dark:ring-white/5 ${positionClasses[position]}`}
          >
            {content}
            {/* Arrow */}
            <div 
              style={{ transform: `translateX(${-offset}px) translateX(-50%)` }}
              className={`absolute border-4 border-transparent left-1/2 ${
                position === 'top' ? 'top-full border-t-white dark:border-t-[#1A1A1A]' :
                position === 'bottom' ? 'bottom-full border-b-white dark:border-b-[#1A1A1A]' :
                position === 'left' ? 'left-full top-1/2 -translate-y-1/2 border-l-white dark:border-l-[#1A1A1A]' :
                'right-full top-1/2 -translate-y-1/2 border-r-white dark:border-r-[#1A1A1A]'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
