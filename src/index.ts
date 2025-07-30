// Main entry point - optimized for tree-shaking
export {
  AnimateOnView,
  AnimationProvider,
  useAnimationContext,
  useMergedAnimationConfig,
  useAnimationDisabled,
  AnimationErrorBoundary,
  withAnimationErrorBoundary,
} from './components';
export { useScrollAnimation, useIntersectionObserver } from './hooks';

// SSR and Next.js utilities
export {
  ClientOnly,
  useHydrationSafe,
  useSSRSafeState,
  useIsomorphicLayoutEffect,
  clientOnly,
  createSafeRefCallback,
  getSSRSafeInitialState,
  hasIntersectionObserver,
  hasMatchMedia,
  withSSRSafety,
  nextjsUtils,
  getSSRSafeAnimationConfig,
  createSSRSafeHandler,
} from './utils/ssrUtils';

export {
  NextJSAnimateOnView,
  withNextJSCompat,
  createDynamicAnimationComponent,
  useNextJSCompat,
  NextJSImageAnimation,
  appRouterUtils,
  pagesRouterUtils,
  getNextJSAnimationConfig,
  appRouterEnhanced,
  middlewareCompat,
  nextjsPerformance,
  routeChangeHandler,
} from './utils/nextjsCompat';

// Export all types for TypeScript users
export type {
  // Animation types
  AnimationType,
  AnimationDirection,
  EasingFunction,

  // Component types
  AnimationConfig,
  AnimateOnViewProps,
  AnimationCallback,
  AnimationState,
  ElementAnimationData,
  AnimationContextValue,
  AnimationProviderProps,

  // Hook types
  UseScrollAnimationReturn,
  UseIntersectionObserverOptions,
  UseIntersectionObserverReturn,
  ObserverManager,
  AnimationLifecycleCallbacks,

  // Error types
  ErrorCode,

  // Utility types
  CSSAnimationProperties,
  AnimationKeyframe,
  MotionPreference,
  ViewportInfo,
  ElementPosition,
  AnimationTiming,
  AnimationClasses,
} from './types';

// Export browser compatibility types
export type { BrowserCompatibility } from './utils/browserCompat';

// Export error classes and constants
export { AnimationError, ErrorCodes } from './types';

// Export browser compatibility utilities
export {
  getBrowserCompatibility,
  hasMinimumSupport,
  hasOptimalSupport,
  getFallbackStrategy,
  createIntersectionObserverPolyfill,
  warnAboutCompatibility,
  getVendorPrefixedProperty,
  applyVendorPrefixes,
} from './utils/browserCompat';

// Export validation utilities
export {
  validateDuration,
  validateDelay,
  validateOffset,
  validateAnimationType,
  validateAnimationDirection,
  validateEasing,
  validateAnimationConfig,
  normalizeAnimationConfig,
  checkBrowserCompatibility,
  validateElement,
} from './utils/animationUtils';
