// Fade animations - CSS transforms only, no keyframes

import { CSSAnimationProperties, AnimationKeyframe } from '../types';

/**
 * Fade animation definition
 * Ultra-optimized with GPU acceleration hints
 */
export const fadeAnimation: AnimationKeyframe = {
  from: {
    opacity: 0,
    transform: 'translateZ(0)', // Force GPU layer
    willChange: 'opacity, transform',
    backfaceVisibility: 'hidden',
  },
  to: {
    opacity: 1,
    transform: 'translateZ(0)', // Maintain GPU layer
    willChange: 'auto', // Clean up will-change after animation
    backfaceVisibility: 'hidden',
  },
};

/**
 * Creates fade animation styles for initial state
 * GPU-accelerated with minimal object creation
 */
export const createFadeInitialStyles = (): CSSAnimationProperties => ({
  opacity: 0,
  transform: 'translateZ(0)', // Force GPU layer
  willChange: 'opacity, transform',
  backfaceVisibility: 'hidden',
});

/**
 * Creates fade animation styles for animated state
 * GPU-accelerated with cleanup hints
 */
export const createFadeAnimatedStyles = (): CSSAnimationProperties => ({
  opacity: 1,
  transform: 'translateZ(0)', // Maintain GPU layer
  willChange: 'auto', // Clean up will-change after animation
  backfaceVisibility: 'hidden',
});

/**
 * Gets fade animation styles based on phase
 * Single function for both initial and animated states
 */
export const getFadeStyles = (
  phase: 'initial' | 'animate'
): CSSAnimationProperties => {
  return phase === 'initial'
    ? createFadeInitialStyles()
    : createFadeAnimatedStyles();
};

/**
 * Creates fade animation keyframe (alias for consistency)
 * Returns the fade animation definition
 */
export const createFadeAnimation = (): AnimationKeyframe => fadeAnimation;
