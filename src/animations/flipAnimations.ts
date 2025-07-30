// Flip animations - minimal implementation to reduce bundle size

import {
  CSSAnimationProperties,
  AnimationKeyframe,
  AnimationDirection,
} from '../types';

/**
 * Flip animation transforms for different directions
 * Ultra-optimized with GPU acceleration and translateZ(0)
 */
const flipTransforms = {
  up: {
    initial: 'perspective(400px) rotateX(90deg) translateZ(0)',
    animate: 'perspective(400px) rotateX(0deg) translateZ(0)',
  },
  down: {
    initial: 'perspective(400px) rotateX(-90deg) translateZ(0)',
    animate: 'perspective(400px) rotateX(0deg) translateZ(0)',
  },
  left: {
    initial: 'perspective(400px) rotateY(-90deg) translateZ(0)',
    animate: 'perspective(400px) rotateY(0deg) translateZ(0)',
  },
  right: {
    initial: 'perspective(400px) rotateY(90deg) translateZ(0)',
    animate: 'perspective(400px) rotateY(0deg) translateZ(0)',
  },
} as const;

/**
 * Creates flip animation keyframe for specific direction
 * Ultra-optimized with GPU acceleration hints
 */
export const createFlipAnimation = (
  direction: AnimationDirection = 'up'
): AnimationKeyframe => {
  const transforms = flipTransforms[direction];

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
 * Creates flip animation styles for initial state
 * GPU-accelerated with performance hints
 */
export const createFlipInitialStyles = (
  direction: AnimationDirection = 'up'
): CSSAnimationProperties => {
  const transforms = flipTransforms[direction];

  return {
    transform: transforms.initial,
    opacity: 0,
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden',
  };
};

/**
 * Creates flip animation styles for animated state
 * GPU-accelerated with cleanup hints
 */
export const createFlipAnimatedStyles = (
  direction: AnimationDirection = 'up'
): CSSAnimationProperties => {
  const transforms = flipTransforms[direction];

  return {
    transform: transforms.animate,
    opacity: 1,
    willChange: 'auto', // Clean up will-change after animation
    backfaceVisibility: 'hidden',
  };
};

/**
 * Gets flip animation styles based on phase and direction
 * Single function for both initial and animated states
 */
export const getFlipStyles = (
  phase: 'initial' | 'animate',
  direction: AnimationDirection = 'up'
): CSSAnimationProperties => {
  return phase === 'initial'
    ? createFlipInitialStyles(direction)
    : createFlipAnimatedStyles(direction);
};
