// Utility functions - tree-shakable exports

// Motion preference utilities
export { getMotionPreference, shouldReduceMotion, isSSR } from './motionUtils';

// CSS utilities
export {
  generateAnimationClasses,
  createAnimationStyles,
  createTransition,
} from './cssUtils';

// Animation validation utilities
export {
  validateDuration,
  validateDelay,
  validateOffset,
  validateAnimationType,
  validateAnimationDirection,
  validateEasing,
  validateAnimationConfig,
  normalizeAnimationConfig,
} from './animationUtils';

// Easing utilities
export { BUILT_IN_EASINGS, getEasing, isBuiltInEasing } from './easingUtils';

// Viewport utilities
export {
  getViewportInfo,
  getElementPosition,
  isElementInViewport,
  calculateIntersectionRatio,
  offsetToRootMargin,
  createRootMargin,
  shouldTriggerAnimation,
  calculateThresholds,
  calculateElementThreshold,
  shouldTriggerWithThreshold,
} from './viewportUtils';

// Observer management
export { createObserverManager, observerManager } from './observerManager';

// SSR utilities
export {
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
} from './ssrUtils';
