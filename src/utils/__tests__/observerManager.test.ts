// Tests for Intersection Observer management system
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createObserverManager } from '../observerManager';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

mockIntersectionObserver.mockImplementation(callback => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
  callback,
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).IntersectionObserver = mockIntersectionObserver;

describe('observerManager', () => {
  let manager: ReturnType<typeof createObserverManager>;
  let mockElement: HTMLElement;
  let mockCallback: vi.Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    manager = createObserverManager();
    mockElement = document.createElement('div');
    mockCallback = vi.fn();
  });

  afterEach(() => {
    manager.disconnect();
  });

  describe('observe', () => {
    it('should create IntersectionObserver and observe element', () => {
      manager.observe(mockElement, mockCallback);

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          root: null,
          rootMargin: '0px',
          threshold: 0,
        }
      );
      expect(mockObserve).toHaveBeenCalledWith(mockElement);
    });

    it('should use custom options when provided', () => {
      const options = {
        root: document.body,
        rootMargin: '10px',
        threshold: 0.5,
      };

      manager.observe(mockElement, mockCallback, options);

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        options
      );
    });

    it('should convert offset to rootMargin when offset is provided', () => {
      const options = {
        offset: 50,
        threshold: 0.3,
      };

      manager.observe(mockElement, mockCallback, options);

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          root: null,
          rootMargin: '50px 50px 50px 50px',
          threshold: 0.3,
        }
      );
    });

    it('should prioritize explicit rootMargin over offset', () => {
      const options = {
        rootMargin: '20px',
        offset: 50,
        threshold: 0.2,
      };

      manager.observe(mockElement, mockCallback, options);

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          root: null,
          rootMargin: '20px',
          threshold: 0.2,
        }
      );
    });

    it('should reuse observer instances with same effective configuration', () => {
      const element1 = document.createElement('div');
      const element2 = document.createElement('div');
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      // Both should use the same observer instance since they have the same effective config
      manager.observe(element1, callback1, { offset: 25 });
      manager.observe(element2, callback2, { offset: 25 });

      // Should only create one observer instance
      expect(mockIntersectionObserver).toHaveBeenCalledTimes(1);
      expect(mockObserve).toHaveBeenCalledTimes(2);
    });

    it('should unobserve existing element before re-observing', () => {
      // First observation
      manager.observe(mockElement, mockCallback);

      // Second observation of same element
      manager.observe(mockElement, mockCallback);

      expect(mockUnobserve).toHaveBeenCalledWith(mockElement);
      expect(mockObserve).toHaveBeenCalledTimes(2);
    });
  });

  describe('unobserve', () => {
    it('should unobserve element when it exists', () => {
      manager.observe(mockElement, mockCallback);
      manager.unobserve(mockElement);

      expect(mockUnobserve).toHaveBeenCalledWith(mockElement);
    });

    it('should handle unobserving non-observed element gracefully', () => {
      expect(() => {
        manager.unobserve(mockElement);
      }).not.toThrow();
    });
  });

  describe('disconnect', () => {
    it('should disconnect all observers', () => {
      manager.observe(mockElement, mockCallback);
      manager.disconnect();

      expect(mockDisconnect).toHaveBeenCalled();
    });
  });
});
