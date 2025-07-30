// Built-in easing functions - zero dependencies, minimal size

import { EasingFunction } from '../types';

/**
 * Built-in CSS easing functions
 * No custom implementations to keep bundle size minimal
 */
export const BUILT_IN_EASINGS: Record<string, EasingFunction> = {
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  linear: 'linear',
} as const;

/**
 * Gets easing function with fallback
 * Single line lookup for performance
 */
export const getEasing = (easing?: EasingFunction): EasingFunction => {
  return easing || BUILT_IN_EASINGS.ease;
};

/**
 * Checks if easing is a built-in CSS function
 * Early return for performance
 */
export const isBuiltInEasing = (easing: EasingFunction): boolean => {
  const easingValues = [
    BUILT_IN_EASINGS.ease,
    BUILT_IN_EASINGS.easeIn,
    BUILT_IN_EASINGS.easeOut,
    BUILT_IN_EASINGS.easeInOut,
    BUILT_IN_EASINGS.linear,
  ];
  return easingValues.indexOf(easing) !== -1;
};
