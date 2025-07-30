// Tests for animation definitions
import { describe, it, expect } from 'vitest';
import {
  getAnimationStyles,
  createCompleteAnimationStyles,
  getMirrorAnimationStyles,
} from '../index';
import { getFadeStyles } from '../fadeAnimations';
import { getSlideStyles } from '../slideAnimations';
import { getZoomStyles } from '../zoomAnimations';
import { getFlipStyles } from '../flipAnimations';

describe('Animation Definitions', () => {
  describe('getAnimationStyles', () => {
    it('should return fade animation styles', () => {
      const initialStyles = getAnimationStyles('fade', 'up', 'initial');
      const animateStyles = getAnimationStyles('fade', 'up', 'animate');

      expect(initialStyles.opacity).toBe(0);
      expect(animateStyles.opacity).toBe(1);
      expect(initialStyles.willChange).toBe('opacity, transform');
    });

    it('should return slide animation styles for different directions', () => {
      const slideUp = getAnimationStyles('slide', 'up', 'initial');
      const slideDown = getAnimationStyles('slide', 'down', 'initial');
      const slideLeft = getAnimationStyles('slide', 'left', 'initial');
      const slideRight = getAnimationStyles('slide', 'right', 'initial');

      expect(slideUp.transform).toBe('translate3d(0, 30px, 0)');
      expect(slideDown.transform).toBe('translate3d(0, -30px, 0)');
      expect(slideLeft.transform).toBe('translate3d(30px, 0, 0)');
      expect(slideRight.transform).toBe('translate3d(-30px, 0, 0)');
    });

    it('should return zoom animation styles', () => {
      const initialStyles = getAnimationStyles('zoom', 'up', 'initial');
      const animateStyles = getAnimationStyles('zoom', 'up', 'animate');

      expect(initialStyles.transform).toBe(
        'scale3d(0.8, 0.8, 1) translateZ(0)'
      );
      expect(animateStyles.transform).toBe('scale3d(1, 1, 1) translateZ(0)');
      expect(initialStyles.opacity).toBe(0);
      expect(animateStyles.opacity).toBe(1);
    });

    it('should return flip animation styles', () => {
      const initialStyles = getAnimationStyles('flip', 'up', 'initial');
      const animateStyles = getAnimationStyles('flip', 'up', 'animate');

      expect(initialStyles.transform).toBe(
        'perspective(400px) rotateX(90deg) translateZ(0)'
      );
      expect(animateStyles.transform).toBe(
        'perspective(400px) rotateX(0deg) translateZ(0)'
      );
    });

    it('should fallback to fade animation for unknown types', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const styles = getAnimationStyles('unknown' as any, 'up', 'initial');
      expect(styles.opacity).toBe(0);
      expect(styles.willChange).toBe('opacity, transform');
    });
  });

  describe('createCompleteAnimationStyles', () => {
    it('should add transition for animate phase', () => {
      const styles = createCompleteAnimationStyles(
        'fade',
        'up',
        'animate',
        600,
        100,
        'ease-in'
      );

      expect(styles.transition).toBe('all 600ms ease-in 100ms');
      expect(styles.opacity).toBe(1);
    });

    it('should not add transition for initial phase', () => {
      const styles = createCompleteAnimationStyles(
        'fade',
        'up',
        'initial',
        600,
        100,
        'ease-in'
      );

      expect(styles.transition).toBeUndefined();
      expect(styles.opacity).toBe(0);
    });
  });

  describe('getMirrorAnimationStyles', () => {
    it('should return initial styles for mirror effect', () => {
      const mirrorStyles = getMirrorAnimationStyles('slide', 'up');
      const initialStyles = getAnimationStyles('slide', 'up', 'initial');

      expect(mirrorStyles).toEqual(initialStyles);
    });
  });

  describe('Individual animation functions', () => {
    it('should export individual animation functions', () => {
      expect(typeof getFadeStyles).toBe('function');
      expect(typeof getSlideStyles).toBe('function');
      expect(typeof getZoomStyles).toBe('function');
      expect(typeof getFlipStyles).toBe('function');
    });

    it('should work with individual animation functions', () => {
      const fadeStyles = getFadeStyles('initial');
      const slideStyles = getSlideStyles('initial', 'up');
      const zoomStyles = getZoomStyles('initial', 'up');
      const flipStyles = getFlipStyles('initial', 'up');

      expect(fadeStyles.opacity).toBe(0);
      expect(slideStyles.transform).toBe('translate3d(0, 30px, 0)');
      expect(zoomStyles.transform).toBe('scale3d(0.8, 0.8, 1) translateZ(0)');
      expect(flipStyles.transform).toBe(
        'perspective(400px) rotateX(90deg) translateZ(0)'
      );
    });
  });
});
