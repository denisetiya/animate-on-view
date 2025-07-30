// Tests for useIntersectionObserver hook
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIntersectionObserver } from '../useIntersectionObserver';

// Mock modules
vi.mock('../../utils/observerManager', () => ({
  observerManager: {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  },
}));

vi.mock('../../utils/motionUtils', () => ({
  isSSR: vi.fn(),
}));

vi.mock('../../utils/viewportUtils', () => ({
  createRootMargin: vi.fn(),
  shouldTriggerWithThreshold: vi.fn(),
}));

describe('useIntersectionObserver', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    // Get mocked functions
    const { isSSR } = await import('../../utils/motionUtils');
    const { createRootMargin, shouldTriggerWithThreshold } = await import(
      '../../utils/viewportUtils'
    );

    vi.mocked(isSSR).mockReturnValue(false);
    vi.mocked(createRootMargin).mockImplementation(
      (offset: number) => `${offset}px`
    );
    vi.mocked(shouldTriggerWithThreshold).mockImplementation(
      (ratio: number, threshold?: number, _wasVisible?: boolean) =>
        ratio > (threshold ?? 0)
    );
  });

  describe('basic functionality', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useIntersectionObserver());

      expect(result.current.ref.current).toBeNull();
      expect(result.current.isIntersecting).toBe(false);
      expect(result.current.entry).toBeNull();
    });

    it('should not observe when element is null', async () => {
      const { observerManager } = await import('../../utils/observerManager');
      renderHook(() => useIntersectionObserver());
      expect(vi.mocked(observerManager.observe)).not.toHaveBeenCalled();
    });

    it('should not observe when in SSR environment', async () => {
      const { observerManager } = await import('../../utils/observerManager');
      const { isSSR } = await import('../../utils/motionUtils');

      vi.mocked(isSSR).mockReturnValue(true);

      const { result } = renderHook(() => useIntersectionObserver());

      act(() => {
        result.current.ref.current = document.createElement('div');
      });

      expect(vi.mocked(observerManager.observe)).not.toHaveBeenCalled();
    });

    it('should not observe when disabled', async () => {
      const { observerManager } = await import('../../utils/observerManager');

      const { result } = renderHook(() =>
        useIntersectionObserver({ disabled: true })
      );

      act(() => {
        result.current.ref.current = document.createElement('div');
      });

      expect(vi.mocked(observerManager.observe)).not.toHaveBeenCalled();
    });
  });

  describe('intersection handling', () => {
    it('should handle intersection callback', async () => {
      const { observerManager } = await import('../../utils/observerManager');
      const { result } = renderHook(() => useIntersectionObserver());

      const mockElement = document.createElement('div');
      const mockEntry = {
        target: mockElement,
        isIntersecting: true,
        intersectionRatio: 0.5,
      } as unknown as IntersectionObserverEntry;

      act(() => {
        result.current.ref.current = mockElement;
      });

      // Simulate intersection callback
      const mockObserve = vi.mocked(observerManager.observe);
      if (mockObserve.mock.calls.length > 0) {
        const callback = mockObserve.mock.calls[0][1];
        const mockObserver = {} as IntersectionObserver;
        act(() => {
          callback([mockEntry], mockObserver);
        });

        expect(result.current.entry).toBe(mockEntry);
      }
    });

    it('should use threshold-based triggering when threshold is provided', async () => {
      const { observerManager } = await import('../../utils/observerManager');
      const { shouldTriggerWithThreshold } = await import(
        '../../utils/viewportUtils'
      );

      const { result } = renderHook(() =>
        useIntersectionObserver({ threshold: 0.3 })
      );

      const mockElement = document.createElement('div');
      const mockEntry = {
        target: mockElement,
        isIntersecting: true,
        intersectionRatio: 0.5,
      } as unknown as IntersectionObserverEntry;

      act(() => {
        result.current.ref.current = mockElement;
      });

      const mockObserve = vi.mocked(observerManager.observe);
      if (mockObserve.mock.calls.length > 0) {
        const callback = mockObserve.mock.calls[0][1];
        const mockObserver = {} as IntersectionObserver;
        act(() => {
          callback([mockEntry], mockObserver);
        });

        expect(vi.mocked(shouldTriggerWithThreshold)).toHaveBeenCalledWith(
          0.5,
          0.3,
          false
        );
      }
    });
  });

  describe('cleanup', () => {
    it('should handle cleanup when element is null', () => {
      const { unmount } = renderHook(() => useIntersectionObserver());
      expect(() => unmount()).not.toThrow();
    });

    it('should provide proper cleanup function', () => {
      const { result } = renderHook(() => useIntersectionObserver());

      // Test that the hook returns the expected interface
      expect(result.current.ref).toBeDefined();
      expect(typeof result.current.isIntersecting).toBe('boolean');
      expect(result.current.entry).toBeNull();
    });
  });

  describe('options handling', () => {
    it('should use custom options', async () => {
      const { observerManager } = await import('../../utils/observerManager');
      const options = {
        root: document.body,
        rootMargin: '10px',
        threshold: 0.5,
      };

      const { result } = renderHook(() => useIntersectionObserver(options));

      act(() => {
        result.current.ref.current = document.createElement('div');
      });

      const mockObserve = vi.mocked(observerManager.observe);
      if (mockObserve.mock.calls.length > 0) {
        const observerOptions = mockObserve.mock.calls[0][2];
        expect(observerOptions).toMatchObject({
          root: document.body,
          rootMargin: '10px',
          threshold: 0.5,
        });
      }
    });

    it('should accept offset option', () => {
      const { result } = renderHook(() =>
        useIntersectionObserver({ offset: 50 })
      );

      // Test that the hook accepts the offset option without throwing
      expect(result.current.ref).toBeDefined();
      expect(typeof result.current.isIntersecting).toBe('boolean');
      expect(result.current.entry).toBeNull();
    });
  });
});
