// Animation definitions - inline styles, zero dependencies

import {
  AnimationType,
  AnimationDirection,
  CSSAnimationProperties,
} from '../types';
import { getFadeStyles } from './fadeAnimations';
import { getSlideStyles } from './slideAnimations';
import { getZoomStyles } from './zoomAnimations';
import { getFlipStyles } from './flipAnimations';

/**
 * Main animation factory function
 * Returns inline styles for any animation type and phase
 * Zero dependencies, uses only CSS transforms and opacity
 */
export const getAnimationStyles = (
  type: AnimationType,
  direction: AnimationDirection = 'up',
  phase: 'initial' | 'animate' = 'initial'
): CSSAnimationProperties => {
  switch (type) {
    case 'fade': {
      return getFadeStyles(phase);
    }

    case 'slide': {
      return getSlideStyles(phase, direction);
    }

    case 'zoom': {
      return getZoomStyles(phase, direction);
    }

    case 'flip': {
      return getFlipStyles(phase, direction);
    }

    default: {
      // Fallback to fade animation
      return getFadeStyles(phase);
    }
  }
};

/**
 * Creates complete animation styles with transition
 * Combines animation styles with CSS transition for smooth animations
 */
export const createCompleteAnimationStyles = (
  type: AnimationType,
  direction: AnimationDirection = 'up',
  phase: 'initial' | 'animate' = 'initial',
  duration: number = 600,
  delay: number = 0,
  easing: string = 'ease'
): CSSAnimationProperties => {
  const animationStyles = getAnimationStyles(type, direction, phase);

  // Add transition only for animate phase to prevent initial transition
  if (phase === 'animate') {
    animationStyles.transition = `all ${duration}ms ${easing} ${delay}ms`;
  }

  return animationStyles;
};

/**
 * Gets animation styles for mirror effect (reverse animation)
 * Used when element leaves viewport with mirror: true
 */
export const getMirrorAnimationStyles = (
  type: AnimationType,
  direction: AnimationDirection = 'up'
): CSSAnimationProperties => {
  // Mirror effect is just the initial state
  return getAnimationStyles(type, direction, 'initial');
};

// Export individual animation functions for tree-shaking
export { getFadeStyles } from './fadeAnimations';
export { getSlideStyles } from './slideAnimations';
export { getZoomStyles } from './zoomAnimations';
export { getFlipStyles } from './flipAnimations';

// Export animation creators for advanced usage
export { createFadeAnimation } from './fadeAnimations';
export { createSlideAnimation } from './slideAnimations';
export { createZoomAnimation } from './zoomAnimations';
export { createFlipAnimation } from './flipAnimations';
