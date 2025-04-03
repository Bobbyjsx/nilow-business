'use client';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

export const FadeIn = ({ children, duration = 200, className }: { children: React.ReactNode; duration?: number; className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), duration);
        }
      },
      { threshold: 0.1 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [duration]);

  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all duration-300 ease-in-out',
        {
          'opacity-0 translate-y-4': !isVisible,
          'opacity-100 translate-y-0': isVisible,
        },
        className,
      )}
    >
      {children}
    </div>
  );
};
