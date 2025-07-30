// Browser compatibility utilities with graceful fallbacks
import { ErrorCodes } from '../types/errors';

export interface BrowserCompatibility {
  intersectionObserver: boolean;
  cssTransforms: boolean;
  cssTransitions: boolean;
  reducedMotion: boolean;
  webAnimations: boolean;
  passiveEvents: boolean;
}

/**
 * Comprehensive browser compatibility check
 * Caches results for performance
 */
let compatibilityCache: BrowserCompatibility | null = null;

/**
 * Reset compatibility cache (for testing purposes)
 */
export const resetCompatibilityCache = () => {
  compatibilityCache = null;
};

export const getBrowserCompatibility = (): BrowserCompatibility => {
  // Return cached result if available
  if (compatibilityCache) {
    return compatibilityCache;
  }

  const compatibility: BrowserCompatibility = {
    intersectionObserver: false,
    cssTransforms: false,
    cssTransitions: false,
    reducedMotion: false,
    webAnimations: false,
    passiveEvents: false,
  };

  // Server-side rendering - return false for all features
  if (typeof window === 'undefined') {
    compatibilityCache = compatibility;
    return compatibility;
  }

  try {
    // Check for Intersection Observer support
    compatibility.intersectionObserver =
      'IntersectionObserver' in window && 'IntersectionObserverEntry' in window;

    // Check for CSS transforms support
    const testElement = document.createElement('div');
    const transformProperties = [
      'transform',
      'webkitTransform',
      'mozTransform',
      'msTransform',
    ];
    compatibility.cssTransforms = transformProperties.some(
      prop => prop in testElement.style
    );

    // Check for CSS transitions support
    const transitionProperties = [
      'transition',
      'webkitTransition',
      'mozTransition',
      'msTransition',
    ];
    compatibility.cssTransitions = transitionProperties.some(
      prop => prop in testElement.style
    );

    // Check for reduced motion support
    compatibility.reducedMotion =
      window.matchMedia &&
      typeof window.matchMedia('(prefers-reduced-motion)').matches ===
        'boolean';

    // Check for Web Animations API support
    compatibility.webAnimations = 'animate' in testElement;

    // Check for passive event listeners support
    let passiveSupported = false;
    try {
      const options = {
        get passive() {
          passiveSupported = true;
          return false;
        },
      };
      window.addEventListener(
        'test',
        () => {},
        options as EventListenerOptions
      );
      window.removeEventListener(
        'test',
        () => {},
        options as EventListenerOptions
      );
    } catch {
      passiveSupported = false;
    }
    compatibility.passiveEvents = passiveSupported;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error checking browser compatibility:', error);
    }
  }

  // Cache the result
  compatibilityCache = compatibility;
  return compatibility;
};

/**
 * Checks if the browser supports the minimum required features
 * Returns true if basic animation features are available
 */
export const hasMinimumSupport = (): boolean => {
  const compat = getBrowserCompatibility();
  return compat.cssTransforms && compat.cssTransitions;
};

/**
 * Checks if the browser supports optimal animation features
 * Returns true if all modern features are available
 */
export const hasOptimalSupport = (): boolean => {
  const compat = getBrowserCompatibility();
  return (
    compat.intersectionObserver &&
    compat.cssTransforms &&
    compat.cssTransitions &&
    compat.passiveEvents
  );
};

/**
 * Gets appropriate fallback strategy based on browser capabilities
 */
export const getFallbackStrategy = () => {
  const compat = getBrowserCompatibility();

  if (!compat.intersectionObserver) {
    return {
      strategy: 'immediate' as const,
      reason: 'Intersection Observer not supported',
      code: ErrorCodes.OBSERVER_NOT_SUPPORTED,
    };
  }

  if (!compat.cssTransforms || !compat.cssTransitions) {
    return {
      strategy: 'static' as const,
      reason: 'CSS transforms/transitions not supported',
      code: ErrorCodes.OBSERVER_NOT_SUPPORTED,
    };
  }

  return {
    strategy: 'full' as const,
    reason: 'Full support available',
    code: null,
  };
};

/**
 * Polyfill for Intersection Observer (basic implementation)
 * Only used as a last resort fallback
 */
export const createIntersectionObserverPolyfill = () => {
  if (typeof window === 'undefined' || 'IntersectionObserver' in window) {
    return;
  }

  // Basic polyfill that immediately triggers callbacks
  // This is a minimal fallback, not a full polyfill
  class IntersectionObserverPolyfill {
    private callback: IntersectionObserverCallback;
    private elements: Set<Element> = new Set();

    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }

    observe(element: Element) {
      this.elements.add(element);
      // Immediately trigger callback with intersecting state
      setTimeout(() => {
        this.callback(
          [
            {
              target: element,
              isIntersecting: true,
              intersectionRatio: 1,
              boundingClientRect: element.getBoundingClientRect(),
              rootBounds: null,
              intersectionRect: element.getBoundingClientRect(),
              time: Date.now(),
            } as IntersectionObserverEntry,
          ],
          this as any
        );
      }, 0);
    }

    unobserve(element: Element) {
      this.elements.delete(element);
    }

    disconnect() {
      this.elements.clear();
    }
  }

  // Only assign if not already present
  if (!('IntersectionObserver' in window)) {
    (window as any).IntersectionObserver = IntersectionObserverPolyfill;
  }
};

/**
 * Warns about browser compatibility issues in development
 */
export const warnAboutCompatibility = () => {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const compat = getBrowserCompatibility();
  const warnings: string[] = [];

  if (!compat.intersectionObserver) {
    warnings.push(
      'Intersection Observer not supported - animations will show immediately'
    );
  }

  if (!compat.cssTransforms) {
    warnings.push(
      'CSS transforms not supported - animations may not work properly'
    );
  }

  if (!compat.cssTransitions) {
    warnings.push('CSS transitions not supported - animations will be instant');
  }

  if (!compat.passiveEvents) {
    warnings.push(
      'Passive event listeners not supported - may impact scroll performance'
    );
  }

  if (warnings.length > 0) {
    console.group('⚠️ Browser Compatibility Warnings');
    warnings.forEach(warning => console.warn(warning));
    console.info(
      '💡 Consider using polyfills or providing fallbacks for better compatibility'
    );
    console.groupEnd();
  }
};

/**
 * Gets vendor-prefixed CSS property name
 */
export const getVendorPrefixedProperty = (property: string): string => {
  if (typeof window === 'undefined') {
    return property;
  }

  const testElement = document.createElement('div');
  const prefixes = ['', 'webkit', 'moz', 'ms'];

  for (const prefix of prefixes) {
    const prefixedProperty = prefix
      ? `${prefix}${property.charAt(0).toUpperCase()}${property.slice(1)}`
      : property;
    if (prefixedProperty in testElement.style) {
      return prefixedProperty;
    }
  }

  return property; // Fallback to original property
};

/**
 * Applies vendor prefixes to CSS properties
 */
export const applyVendorPrefixes = (
  styles: Record<string, string>
): Record<string, string> => {
  const prefixedStyles: Record<string, string> = {};

  for (const [property, value] of Object.entries(styles)) {
    const prefixedProperty = getVendorPrefixedProperty(property);
    prefixedStyles[prefixedProperty] = value;
  }

  return prefixedStyles;
};
