// Motion preference detection utilities - zero dependencies

import { MotionPreference } from '../types';

/**
 * Detects user's motion preference with minimal overhead
 * Single line check for maximum performance
 */
export const getMotionPreference = (): MotionPreference => {
  if (typeof window === 'undefined') {
    return 'no-preference';
  }

  try {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
      ? 'reduce'
      : 'no-preference';
  } catch {
    return 'no-preference';
  }
};

/**
 * Checks if animations should be disabled based on user preference
 * Ultra-lightweight check with early return
 */
export const shouldReduceMotion = (): boolean => {
  return getMotionPreference() === 'reduce';
};

/**
 * Checks if we're in a server-side rendering environment
 * Minimal SSR detection
 */
export const isSSR = (): boolean => {
  return typeof window === 'undefined';
};

/**
 * Checks if we're in a browser environment
 * Opposite of isSSR for clarity
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Checks if the component is currently hydrating
 * Detects the transition from SSR to client-side
 */
export const isHydrating = (): boolean => {
  return (
    isBrowser() &&
    !document.querySelector('[data-reactroot]') &&
    !document.querySelector('#__next')
  );
};

/**
 * Safe window access for SSR environments
 * Returns undefined on server, window on client
 */
export const safeWindow = (): Window | undefined => {
  return isBrowser() ? window : undefined;
};

/**
 * Safe document access for SSR environments
 * Returns undefined on server, document on client
 */
export const safeDocument = (): Document | undefined => {
  return isBrowser() ? document : undefined;
};
