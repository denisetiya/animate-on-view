import { ReactNode, CSSProperties } from 'react';
import {
  AnimationType,
  AnimationDirection,
  EasingFunction,
} from './animations';

// Animation configuration interface
export interface AnimationConfig {
  type: AnimationType;
  direction?: AnimationDirection;
  duration?: number; // 100-3000ms
  delay?: number; // 0-2000ms
  easing?: EasingFunction;
  offset?: number; // pixels from viewport edge
  once?: boolean; // animate only once
  mirror?: boolean; // animate out when scrolling past
}

// Callback types
export type AnimationCallback = (element: HTMLElement) => void;

// Animation state management
export interface AnimationState {
  isVisible: boolean;
  isAnimating: boolean;
  hasAnimated: boolean;
  animationPhase: 'idle' | 'entering' | 'visible' | 'leaving' | 'hidden';
}

// Element animation data
export interface ElementAnimationData {
  element: HTMLElement;
  config: AnimationConfig;
  state: AnimationState;
  callbacks: {
    onStart?: AnimationCallback;
    onEnd?: AnimationCallback;
  };
}

// Animation context types
export interface AnimationContextValue {
  globalConfig: Partial<AnimationConfig>;
  disabled: boolean;
  respectMotionPreferences: boolean;
}

export interface AnimationProviderProps {
  children: ReactNode;
  config?: Partial<AnimationConfig>;
  disabled?: boolean;
  respectMotionPreferences?: boolean;
}

// Component props
export interface AnimateOnViewProps extends AnimationConfig {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onAnimationStart?: AnimationCallback;
  onAnimationEnd?: AnimationCallback;
  disabled?: boolean;

  // Accessibility props
  reducedMotionFallback?: AnimationType;
  announceToScreenReader?: boolean;
  screenReaderText?: string;
  provideSkipLink?: boolean;
  skipLinkText?: string;
  voiceControlLabel?: string;
  announceWithSpeech?: boolean;
  speechText?: string;
  showProgressIndicator?: boolean;
  respectAttentionDisorders?: boolean;
  showPlayPauseControls?: boolean;
  respectCognitiveLoad?: boolean;
  accessibilityLabel?: string;
  accessibilityDescription?: string;
  accessibilityRole?: string;
}
