// Performance optimization utilities - Ultra-lightweight

/**
 * Passive event listener options for better scroll performance
 * Prevents default behavior blocking and improves scroll performance
 */
export const passiveEventOptions: AddEventListenerOptions = {
  passive: true,
  capture: false,
};

/**
 * Optimized event listener options with passive support detection
 * Falls back to boolean for older browsers
 */
export const getOptimalEventOptions = (): AddEventListenerOptions | boolean => {
  // Feature detection for passive event listeners
  let supportsPassive = false;

  try {
    const opts = Object.defineProperty({}, 'passive', {
      get() {
        supportsPassive = true;
        return false;
      },
    });

    window.addEventListener('testPassive', () => {}, opts);
    window.removeEventListener('testPassive', () => {}, opts);
  } catch {
    // Passive not supported
  }

  return supportsPassive ? passiveEventOptions : false;
};

/**
 * Cached optimal event options to prevent repeated feature detection
 */
let cachedEventOptions: AddEventListenerOptions | boolean | null = null;

/**
 * Gets cached optimal event options for maximum performance
 * Only performs feature detection once
 */
export const getCachedEventOptions = (): AddEventListenerOptions | boolean => {
  if (cachedEventOptions === null) {
    cachedEventOptions = getOptimalEventOptions();
  }
  return cachedEventOptions;
};

/**
 * Optimized requestAnimationFrame with fallback
 * Uses native rAF when available, setTimeout fallback for older browsers
 */
export const optimizedRAF = (callback: FrameRequestCallback): number => {
  if (typeof window !== 'undefined' && window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback);
  }

  // Fallback for older browsers (60fps target)
  return window.setTimeout(() => callback(Date.now()), 16) as unknown as number;
};

/**
 * Optimized cancelAnimationFrame with fallback
 * Uses native cAF when available, clearTimeout fallback for older browsers
 */
export const optimizedCAF = (id: number): void => {
  if (typeof window !== 'undefined' && window.cancelAnimationFrame) {
    window.cancelAnimationFrame(id);
  } else {
    window.clearTimeout(id);
  }
};

/**
 * Debounced function creator for performance optimization
 * Prevents excessive function calls during rapid events
 */
export const createDebounced = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
};

/**
 * Throttled function creator for performance optimization
 * Limits function execution to once per specified interval
 */
export const createThrottled = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  let timeoutId: number | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else if (timeoutId === null) {
      timeoutId = window.setTimeout(
        () => {
          lastCall = Date.now();
          func(...args);
          timeoutId = null;
        },
        delay - (now - lastCall)
      );
    }
  };
};

/**
 * Memory-efficient style application with batching
 * Applies multiple styles in a single operation to minimize reflows
 */
export const applyStylesBatch = (
  element: HTMLElement,
  styles: Record<string, string | number>
): void => {
  // Batch style changes to minimize reflows
  const cssText = Object.entries(styles)
    .map(([property, value]) => {
      // Convert camelCase to kebab-case for CSS properties
      const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssProperty}: ${value}`;
    })
    .join('; ');

  // Apply all styles at once
  element.style.cssText += `; ${cssText}`;
};

/**
 * Optimized element visibility check
 * Uses getBoundingClientRect for accurate visibility detection
 */
export const isElementVisible = (element: HTMLElement): boolean => {
  if (!element || !element.isConnected) return false;

  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < windowHeight &&
    rect.left < windowWidth
  );
};

/**
 * GPU acceleration hints for optimal animation performance
 * Forces elements onto the GPU layer for smooth animations
 */
export const enableGPUAcceleration = (element: HTMLElement): void => {
  applyStylesBatch(element, {
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    perspective: '1000px',
    willChange: 'transform, opacity',
  });
};

/**
 * Cleanup GPU acceleration hints after animation
 * Removes performance hints to free up GPU memory
 */
export const cleanupGPUAcceleration = (element: HTMLElement): void => {
  applyStylesBatch(element, {
    willChange: 'auto',
  });
};

/**
 * Optimized DOM query caching system
 * Caches DOM queries to minimize repeated lookups
 */
class DOMQueryCache {
  private cache = new Map<string, HTMLElement | null>();
  private observers = new Map<string, MutationObserver>();

  /**
   * Gets element by selector with caching
   * Automatically invalidates cache when DOM changes
   */
  get(
    selector: string,
    root: Document | HTMLElement = document
  ): HTMLElement | null {
    if (this.cache.has(selector)) {
      const cached = this.cache.get(selector);
      // Verify cached element is still in DOM
      if (cached && cached.isConnected) {
        return cached;
      }
      // Remove stale cache entry
      this.cache.delete(selector);
    }

    const element = root.querySelector(selector) as HTMLElement | null;

    if (element) {
      this.cache.set(selector, element);

      // Set up mutation observer to invalidate cache when element is removed
      if (!this.observers.has(selector)) {
        const observer = new MutationObserver(() => {
          if (!element.isConnected) {
            this.cache.delete(selector);
            observer.disconnect();
            this.observers.delete(selector);
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        this.observers.set(selector, observer);
      }
    }

    return element;
  }

  /**
   * Clears all cached queries and observers
   */
  clear(): void {
    this.cache.clear();
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

/**
 * Singleton DOM query cache instance
 * Shared across the entire application for maximum efficiency
 */
export const domQueryCache = new DOMQueryCache();

/**
 * Performance monitoring utilities for development
 * Helps identify performance bottlenecks during development
 */
export const performanceMonitor = {
  /**
   * Measures function execution time
   */
  measure<T>(name: string, fn: () => T): T {
    if (process.env.NODE_ENV !== 'development') {
      return fn();
    }

    const start = performance.now();
    const result = fn();
    const end = performance.now();

    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
  },

  /**
   * Marks performance timeline events
   */
  mark(name: string): void {
    if (process.env.NODE_ENV === 'development' && performance.mark) {
      performance.mark(name);
    }
  },

  /**
   * Measures time between two marks
   */
  measureBetween(name: string, startMark: string, endMark: string): void {
    if (process.env.NODE_ENV === 'development' && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
      } catch {
        // Marks might not exist, ignore
      }
    }
  },
};
