import { RefObject } from 'react';

// Hook return types
export interface UseScrollAnimationReturn {
  ref: ((element: HTMLElement | null) => void) | RefObject<HTMLElement | null>;
  isVisible: boolean;
  isAnimating: boolean;
  trigger: () => void;
  reset: () => void;
}

// Intersection Observer hook types
export interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
  disabled?: boolean;
  offset?: number; // pixels from viewport edge
}

export interface UseIntersectionObserverReturn {
  ref: RefObject<HTMLElement | null>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

// Observer manager types
export interface ObserverManager {
  observe(
    element: HTMLElement,
    callback: (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) => void,
    options?: UseIntersectionObserverOptions
  ): void;
  unobserve(element: HTMLElement): void;
  disconnect(): void;
}

// Animation lifecycle callbacks
export interface AnimationLifecycleCallbacks {
  onStart?: (element: HTMLElement) => void;
  onEnd?: (element: HTMLElement) => void;
  onReset?: (element: HTMLElement) => void;
}
