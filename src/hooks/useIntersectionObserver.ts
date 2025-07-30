// Intersection Observer hook implementation
import { useRef, useState, useEffect, useCallback } from 'react';
import {
  UseIntersectionObserverOptions,
  UseIntersectionObserverReturn,
} from '../types';
import { observerManager } from '../utils/observerManager';
import {
  createRootMargin,
  shouldTriggerWithThreshold,
} from '../utils/viewportUtils';
import { isSSR } from '../utils/motionUtils';
import {
  getSSRSafeInitialState,
  hasIntersectionObserver,
  useEnhancedHydration,
} from '../utils/ssrUtils';

/**
 * Custom hook for Intersection Observer with performance optimizations
 * Uses shared observer instances and proper cleanup
 */
export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn => {
  const elementRef = useRef<HTMLElement | null>(null);

  // Use SSR-safe initial state to prevent hydration mismatches
  const ssrSafeState = getSSRSafeInitialState();
  const [isIntersecting, setIsIntersecting] = useState(
    ssrSafeState.isIntersecting
  );
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const wasVisibleRef = useRef(false);
  // Enhanced hydration tracking for better SSR compatibility
  const { isHydrated, isHydrating } = useEnhancedHydration();

  // Ultra-optimized callback with minimal dependencies and ref caching
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [currentEntry] = entries;
      if (!currentEntry) return;

      // Only process intersection changes after hydration is complete
      if (!isHydrated || isHydrating) return;

      setEntry(currentEntry);

      // Use threshold-based triggering for smooth animations
      const shouldTrigger =
        options.threshold !== undefined
          ? shouldTriggerWithThreshold(
              currentEntry.intersectionRatio,
              Array.isArray(options.threshold)
                ? options.threshold[0]
                : options.threshold,
              wasVisibleRef.current
            )
          : currentEntry.isIntersecting;

      if (shouldTrigger !== isIntersecting) {
        setIsIntersecting(shouldTrigger);
        wasVisibleRef.current = shouldTrigger;

        // If 'once' option is enabled, stop observing after first intersection
        // Use cached element reference to minimize DOM queries
        if (options.once && shouldTrigger && elementRef.current) {
          observerManager.unobserve(elementRef.current);
        }
      }
    },
    [isIntersecting, options.once, options.threshold, isHydrated, isHydrating]
  );

  // Effect to set up and clean up observation
  useEffect(() => {
    const element = elementRef.current;

    // Early return for SSR, if disabled, not hydrated, or no IntersectionObserver support
    if (
      isSSR() ||
      options.disabled ||
      !element ||
      !isHydrated ||
      !hasIntersectionObserver()
    ) {
      return;
    }

    // Prepare observer options with rootMargin from offset
    const observerOptions: UseIntersectionObserverOptions = {
      root: options.root,
      rootMargin:
        options.rootMargin ||
        (options.offset ? createRootMargin(options.offset) : '0px'),
      threshold: options.threshold || 0,
      once: options.once,
      disabled: false, // Always false when we reach this point since we checked options.disabled above
    };

    // Start observing
    observerManager.observe(element, handleIntersection, observerOptions);

    // Cleanup function
    return () => {
      if (element) {
        observerManager.unobserve(element);
      }
    };
  }, [
    handleIntersection,
    options.root,
    options.rootMargin,
    options.threshold,
    options.once,
    options.disabled,
    options.offset,
    isHydrated,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    const element = elementRef.current;
    return () => {
      if (element) {
        observerManager.unobserve(element);
      }
    };
  }, []);

  return {
    ref: elementRef,
    isIntersecting,
    entry,
  };
};
