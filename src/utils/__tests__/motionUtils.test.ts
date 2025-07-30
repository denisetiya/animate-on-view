// Basic tests for motion utilities
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMotionPreference, shouldReduceMotion, isSSR } from '../motionUtils';

describe('motionUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMotionPreference', () => {
    it('should return "reduce" when user prefers reduced motion', () => {
      const mockMatchMedia = vi.fn().mockReturnValue({ matches: true });
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      const result = getMotionPreference();
      expect(result).toBe('reduce');
      expect(mockMatchMedia).toHaveBeenCalledWith(
        '(prefers-reduced-motion: reduce)'
      );
    });

    it('should return "no-preference" when user does not prefer reduced motion', () => {
      const mockMatchMedia = vi.fn().mockReturnValue({ matches: false });
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      const result = getMotionPreference();
      expect(result).toBe('no-preference');
    });
  });

  describe('shouldReduceMotion', () => {
    it('should return true when motion should be reduced', () => {
      const mockMatchMedia = vi.fn().mockReturnValue({ matches: true });
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      const result = shouldReduceMotion();
      expect(result).toBe(true);
    });

    it('should return false when motion should not be reduced', () => {
      const mockMatchMedia = vi.fn().mockReturnValue({ matches: false });
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      const result = shouldReduceMotion();
      expect(result).toBe(false);
    });
  });

  describe('isSSR', () => {
    it('should return false in browser environment', () => {
      const result = isSSR();
      expect(result).toBe(false);
    });
  });
});
