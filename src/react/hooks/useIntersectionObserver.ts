/**
 * @copyright 2025 denisetiya
 * @license MIT
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
}: UseIntersectionObserverProps) => {
  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const callback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    
    if (entry.isIntersecting) {
      setIsInView(true);
      setHasTriggered(true);
    } else if (!triggerOnce || !hasTriggered) {
      setIsInView(false);
    }
  }, [triggerOnce, hasTriggered]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(callback, {
      threshold,
      rootMargin,
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [callback, threshold, rootMargin]);

  return { ref, isInView };
};
