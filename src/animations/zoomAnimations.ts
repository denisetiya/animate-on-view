// Zoom animations - scale3d transforms for hardware acceleration

import {
  CSSAnimationProperties,
  AnimationKeyframe,
  AnimationDirection,
} from '../types';

/**
 * Zoom animation scales for different directions
 * Ultra-optimized with GPU acceleration and translateZ(0)
 */
const zoomScales = {
  up: {
    initial: 'scale3d(0.8, 0.8, 1) translateZ(0)',
    animate: 'scale3d(1, 1, 1) translateZ(0)',
  },
  down: {
    initial: 'scale3d(1.2, 1.2, 1) translateZ(0)',
    animate: 'scale3d(1, 1, 1) translateZ(0)',
  },
  left: {
    initial: 'scale3d(0.8, 0.8, 1) translateZ(0)',
    animate: 'scale3d(1, 1, 1) translateZ(0)',
  },
  right: {
    initial: 'scale3d(0.8, 0.8, 1) translateZ(0)',
    animate: 'scale3d(1, 1, 1) translateZ(0)',
  },
} as const;

/**
 * Creates zoom animation keyframe for specific direction
 * Ultra-optimized with GPU acceleration hints
 */
export const createZoomAnimation = (
  direction: AnimationDirection = 'up'
): AnimationKeyframe => {
  const scales = zoomScales[direction];

  return {
    from: {
      transform: scales.initial,
      opacity: 0,
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden',
    },
    to: {
      transform: scales.animate,
      opacity: 1,
      willChange: 'auto', // Clean up will-change after animation
      backfaceVisibility: 'hidden',
    },
  };
};

/**
 * Creates zoom animation styles for initial state
 * GPU-accelerated with performance hints
 */
export const createZoomInitialStyles = (
  direction: AnimationDirection = 'up'
): CSSAnimationProperties => {
  const scales = zoomScales[direction];

  return {
    transform: scales.initial,
    opacity: 0,
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden',
  };
};

/**
 * Creates zoom animation styles for animated state
 * GPU-accelerated with cleanup hints
 */
export const createZoomAnimatedStyles = (): CSSAnimationProperties => ({
  transform: 'scale3d(1, 1, 1) translateZ(0)',
  opacity: 1,
  willChange: 'auto', // Clean up will-change after animation
  backfaceVisibility: 'hidden',
});

/**
 * Gets zoom animation styles based on phase and direction
 * Single function for both initial and animated states
 */
export const getZoomStyles = (
  phase: 'initial' | 'animate',
  direction: AnimationDirection = 'up'
): CSSAnimationProperties => {
  return phase === 'initial'
    ? createZoomInitialStyles(direction)
    : createZoomAnimatedStyles();
};
