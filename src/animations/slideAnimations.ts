// Slide animations - transform3d for hardware acceleration

import {
  CSSAnimationProperties,
  AnimationKeyframe,
  AnimationDirection,
} from '../types';

/**
 * Slide animation transforms for each direction
 * Ultra-optimized with GPU acceleration and translateZ(0)
 */
const slideTransforms = {
  up: {
    initial: 'translate3d(0, 30px, 0)',
    animate: 'translate3d(0, 0, 0)',
  },
  down: {
    initial: 'translate3d(0, -30px, 0)',
    animate: 'translate3d(0, 0, 0)',
  },
  left: {
    initial: 'translate3d(30px, 0, 0)',
    animate: 'translate3d(0, 0, 0)',
  },
  right: {
    initial: 'translate3d(-30px, 0, 0)',
    animate: 'translate3d(0, 0, 0)',
  },
} as const;

/**
 * Creates slide animation keyframe for specific direction
 * Ultra-optimized with GPU acceleration hints
 */
export const createSlideAnimation = (
  direction: AnimationDirection = 'up'
): AnimationKeyframe => {
  const transforms = slideTransforms[direction];

  return {
    from: {
      transform: transforms.initial,
      opacity: 0,
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden',
    },
    to: {
      transform: transforms.animate,
      opacity: 1,
      willChange: 'auto', // Clean up will-change after animation
      backfaceVisibility: 'hidden',
    },
  };
};

/**
 * Creates slide animation styles for initial state
 * GPU-accelerated with performance hints
 */
export const createSlideInitialStyles = (
  direction: AnimationDirection = 'up'
): CSSAnimationProperties => {
  const transforms = slideTransforms[direction];

  return {
    transform: transforms.initial,
    opacity: 0,
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden',
  };
};

/**
 * Creates slide animation styles for animated state
 * GPU-accelerated with cleanup hints
 */
export const createSlideAnimatedStyles = (): CSSAnimationProperties => ({
  transform: 'translate3d(0, 0, 0)',
  opacity: 1,
  willChange: 'auto', // Clean up will-change after animation
  backfaceVisibility: 'hidden',
});

/**
 * Gets slide animation styles based on phase and direction
 * Single function for both initial and animated states
 */
export const getSlideStyles = (
  phase: 'initial' | 'animate',
  direction: AnimationDirection = 'up'
): CSSAnimationProperties => {
  return phase === 'initial'
    ? createSlideInitialStyles(direction)
    : createSlideAnimatedStyles();
};
