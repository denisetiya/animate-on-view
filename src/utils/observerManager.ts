// Intersection Observer management system - Ultra-optimized with passive listeners

import { UseIntersectionObserverOptions, ObserverManager } from '../types';
import { isSSR } from './motionUtils';
import { createRootMargin } from './viewportUtils';
import { performanceMonitor, optimizedRAF } from './performanceUtils';

/**
 * Shared IntersectionObserver instances for performance optimization
 * Key is a serialized version of the options for instance sharing
 */
const observerInstances = new Map<string, IntersectionObserver>();

/**
 * Element callback mappings for cleanup
 * Maps element to its callback function
 */
const elementCallbacks = new WeakMap<
  HTMLElement,
  (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void
>();

/**
 * Element observer mappings for cleanup
 * Maps element to its observer instance
 */
const elementObservers = new WeakMap<HTMLElement, IntersectionObserver>();

/**
 * Creates a unique key for observer options to enable instance sharing
 * Minimal string operations for performance
 */
const createObserverKey = (
  options: UseIntersectionObserverOptions = {}
): string => {
  const { root, rootMargin, threshold = 0, offset = 0 } = options;

  // Calculate effective rootMargin (prioritize explicit rootMargin over offset)
  const effectiveRootMargin =
    rootMargin || (offset > 0 ? createRootMargin(offset) : '0px');

  const rootKey = root ? 'custom-root' : 'viewport';
  const thresholdKey = Array.isArray(threshold)
    ? threshold.join(',')
    : threshold.toString();
  return `${rootKey}-${effectiveRootMargin}-${thresholdKey}`;
};

/**
 * Gets or creates a shared IntersectionObserver instance
 * Performance optimization: reuse observers with same configuration
 */
const getOrCreateObserver = (
  options: UseIntersectionObserverOptions,
  _callback: (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => void
): IntersectionObserver => {
  const key = createObserverKey(options);

  let observer = observerInstances.get(key);

  if (!observer) {
    const { root, rootMargin, threshold = 0, offset = 0 } = options;

    // Calculate effective rootMargin (prioritize explicit rootMargin over offset)
    const effectiveRootMargin =
      rootMargin || (offset > 0 ? createRootMargin(offset) : '0px');

    // Create new observer with ultra-optimized callback handling
    observer = new IntersectionObserver(
      (entries, obs) => {
        // Use optimized RAF for smooth animation timing
        optimizedRAF(() => {
          performanceMonitor.mark('intersection-processing-start');

          // Batch process entries for better performance
          entries.forEach(entry => {
            const elementCallback = elementCallbacks.get(
              entry.target as HTMLElement
            );
            if (elementCallback) {
              elementCallback([entry], obs);
            }
          });

          performanceMonitor.mark('intersection-processing-end');
          performanceMonitor.measureBetween(
            'intersection-processing',
            'intersection-processing-start',
            'intersection-processing-end'
          );
        });
      },
      {
        root: root || null,
        rootMargin: effectiveRootMargin,
        threshold: threshold,
      }
    );

    observerInstances.set(key, observer);
  }

  return observer;
};

/**
 * Observer Manager implementation
 * Provides centralized observer management with proper cleanup
 */
export const createObserverManager = (): ObserverManager => {
  return {
    /**
     * Observes an element with callback and options
     * Reuses observer instances for performance
     */
    observe(
      element: HTMLElement,
      callback: (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => void,
      options: UseIntersectionObserverOptions = {}
    ): void {
      // Early return for SSR
      if (isSSR()) return;

      // Early return if element is already being observed
      if (elementObservers.has(element)) {
        this.unobserve(element);
      }

      const observer = getOrCreateObserver(options, callback);

      // Store mappings for cleanup
      elementCallbacks.set(element, callback);
      elementObservers.set(element, observer);

      // Start observing
      observer.observe(element);
    },

    /**
     * Stops observing an element
     * Proper cleanup of callbacks and references
     */
    unobserve(element: HTMLElement): void {
      const observer = elementObservers.get(element);

      if (observer) {
        observer.unobserve(element);

        // Clean up mappings
        elementCallbacks.delete(element);
        elementObservers.delete(element);
      }
    },

    /**
     * Disconnects all observers and cleans up
     * Complete cleanup for memory management
     */
    disconnect(): void {
      // Disconnect all observer instances
      observerInstances.forEach(observer => {
        observer.disconnect();
      });

      // Clear all mappings
      observerInstances.clear();
      // Note: WeakMaps will be garbage collected automatically
    },
  };
};

/**
 * Singleton observer manager instance
 * Shared across the entire application for maximum performance
 */
export const observerManager = createObserverManager();
