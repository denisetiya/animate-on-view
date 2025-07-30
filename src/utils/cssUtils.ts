// CSS utilities - zero dependencies, ultra-lightweight

import {
  AnimationType,
  AnimationDirection,
  CSSAnimationProperties,
  AnimationClasses,
} from '../types';

/**
 * Generates CSS class names for animations
 * No external dependencies, minimal string operations
 */
export const generateAnimationClasses = (
  type: AnimationType,
  direction?: AnimationDirection
): AnimationClasses => {
  const baseClass = `rsa-${type}`;
  const directionSuffix = direction ? `-${direction}` : '';

  return {
    base: `${baseClass}${directionSuffix}`,
    entering: `${baseClass}${directionSuffix}-entering`,
    entered: `${baseClass}${directionSuffix}-entered`,
    leaving: `${baseClass}${directionSuffix}-leaving`,
    left: `${baseClass}${directionSuffix}-left`,
  };
};

/**
 * Creates inline CSS properties for animations
 * Ultra-optimized with GPU acceleration and will-change hints
 */
export const createAnimationStyles = (
  type: AnimationType,
  direction: AnimationDirection = 'up',
  phase: 'initial' | 'animate' = 'initial'
): CSSAnimationProperties => {
  // Base styles with GPU acceleration hints
  const styles: CSSAnimationProperties = {
    willChange: phase === 'initial' ? 'transform, opacity' : 'auto',
    backfaceVisibility: 'hidden', // Prevent flickering
    perspective: '1000px', // Enable 3D rendering context
  };

  switch (type) {
    case 'fade': {
      styles.opacity = phase === 'initial' ? 0 : 1;
      // Force GPU layer with translateZ(0) for fade animations
      styles.transform = 'translateZ(0)';
      break;
    }

    case 'slide': {
      const slideTransforms = {
        up:
          phase === 'initial'
            ? 'translate3d(0, 30px, 0)'
            : 'translate3d(0, 0, 0)',
        down:
          phase === 'initial'
            ? 'translate3d(0, -30px, 0)'
            : 'translate3d(0, 0, 0)',
        left:
          phase === 'initial'
            ? 'translate3d(30px, 0, 0)'
            : 'translate3d(0, 0, 0)',
        right:
          phase === 'initial'
            ? 'translate3d(-30px, 0, 0)'
            : 'translate3d(0, 0, 0)',
      };
      styles.transform = slideTransforms[direction];
      styles.opacity = phase === 'initial' ? 0 : 1;
      break;
    }

    case 'zoom': {
      // Use scale3d for hardware acceleration
      const scale =
        phase === 'initial'
          ? 'scale3d(0.8, 0.8, 1) translateZ(0)'
          : 'scale3d(1, 1, 1) translateZ(0)';
      styles.transform = scale;
      styles.opacity = phase === 'initial' ? 0 : 1;
      break;
    }

    case 'flip': {
      const flipTransforms = {
        up:
          phase === 'initial'
            ? 'perspective(400px) rotateX(90deg) translateZ(0)'
            : 'perspective(400px) rotateX(0deg) translateZ(0)',
        down:
          phase === 'initial'
            ? 'perspective(400px) rotateX(-90deg) translateZ(0)'
            : 'perspective(400px) rotateX(0deg) translateZ(0)',
        left:
          phase === 'initial'
            ? 'perspective(400px) rotateY(-90deg) translateZ(0)'
            : 'perspective(400px) rotateY(0deg) translateZ(0)',
        right:
          phase === 'initial'
            ? 'perspective(400px) rotateY(90deg) translateZ(0)'
            : 'perspective(400px) rotateY(0deg) translateZ(0)',
      };
      styles.transform = flipTransforms[direction];
      styles.opacity = phase === 'initial' ? 0 : 1;
      break;
    }
  }

  return styles;
};

/**
 * Creates transition CSS property string
 * Minimal string concatenation for performance
 */
export const createTransition = (
  duration: number,
  delay: number,
  easing: string
): string => {
  return `all ${duration}ms ${easing} ${delay}ms`;
};
