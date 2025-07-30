// Type definitions - tree-shakable exports

// Animation types
export type {
  AnimationType,
  AnimationDirection,
  EasingFunction,
} from './animations';

// Component types
export type {
  AnimationConfig,
  AnimateOnViewProps,
  AnimationCallback,
  AnimationState,
  ElementAnimationData,
  AnimationContextValue,
  AnimationProviderProps,
} from './components';

// Hook types
export type {
  UseScrollAnimationReturn,
  UseIntersectionObserverOptions,
  UseIntersectionObserverReturn,
  ObserverManager,
  AnimationLifecycleCallbacks,
} from './hooks';

// Error types
export { AnimationError, ErrorCodes } from './errors';
export type { ErrorCode } from './errors';

// Utility types
export type {
  CSSAnimationProperties,
  AnimationKeyframe,
  MotionPreference,
  ViewportInfo,
  ElementPosition,
  AnimationTiming,
  AnimationClasses,
} from './utils';
