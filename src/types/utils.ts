// Utility types for animation system

// CSS animation properties
export interface CSSAnimationProperties {
  transform?: string;
  opacity?: number;
  transition?: string;
  willChange?: string;
  backfaceVisibility?: string;
  perspective?: string;
}

// Animation keyframe definition
export interface AnimationKeyframe {
  from: CSSAnimationProperties;
  to: CSSAnimationProperties;
}

// Motion preference detection
export type MotionPreference = 'reduce' | 'no-preference';

// Viewport detection utilities
export interface ViewportInfo {
  width: number;
  height: number;
  scrollY: number;
  scrollX: number;
}

// Element position information
export interface ElementPosition {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

// Animation timing configuration
export interface AnimationTiming {
  duration: number;
  delay: number;
  easing: string;
}

// CSS class generation utilities
export interface AnimationClasses {
  base: string;
  entering: string;
  entered: string;
  leaving: string;
  left: string;
}
