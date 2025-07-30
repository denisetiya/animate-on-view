// Tests for AnimationContext
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  AnimationProvider,
  useAnimationContext,
  useMergedAnimationConfig,
  useAnimationDisabled,
} from '../AnimationContext';
import { AnimationConfig } from '../../types';

// Mock dependencies
vi.mock('../../utils/motionUtils', () => ({
  shouldReduceMotion: vi.fn(),
}));

vi.mock('../../utils/animationUtils', () => ({
  normalizeAnimationConfig: vi.fn(),
}));

// Test component to access context
const TestComponent: React.FC<{ localConfig?: Partial<AnimationConfig> }> = ({
  localConfig = {},
}) => {
  const context = useAnimationContext();
  const mergedConfig = useMergedAnimationConfig(localConfig);
  const isDisabled = useAnimationDisabled();

  return (
    <div>
      <div data-testid="context-exists">{context ? 'true' : 'false'}</div>
      <div data-testid="global-disabled">
        {context?.disabled ? 'true' : 'false'}
      </div>
      <div data-testid="respect-motion">
        {context?.respectMotionPreferences ? 'true' : 'false'}
      </div>
      <div data-testid="merged-type">{mergedConfig.type}</div>
      <div data-testid="merged-duration">{mergedConfig.duration}</div>
      <div data-testid="is-disabled">{isDisabled ? 'true' : 'false'}</div>
    </div>
  );
};

describe('AnimationContext', () => {
  let mockShouldReduceMotion: ReturnType<typeof vi.fn>;
  let mockNormalizeAnimationConfig: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Import mocked modules
    const motionUtils = await import('../../utils/motionUtils');
    const animationUtils = await import('../../utils/animationUtils');

    mockShouldReduceMotion = vi.mocked(motionUtils.shouldReduceMotion);
    mockNormalizeAnimationConfig = vi.mocked(
      animationUtils.normalizeAnimationConfig
    );

    // Setup default mocks
    mockShouldReduceMotion.mockReturnValue(false);
    mockNormalizeAnimationConfig.mockImplementation(config => ({
      type: 'fade',
      duration: 600,
      delay: 0,
      easing: 'ease',
      offset: 0,
      once: true,
      mirror: false,
      ...config,
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('AnimationProvider', () => {
    it('should provide default context values', () => {
      render(
        <AnimationProvider>
          <TestComponent />
        </AnimationProvider>
      );

      expect(screen.getByTestId('context-exists')).toHaveTextContent('true');
      expect(screen.getByTestId('global-disabled')).toHaveTextContent('false');
      expect(screen.getByTestId('respect-motion')).toHaveTextContent('true');
    });

    it('should provide custom configuration', () => {
      const customConfig = {
        type: 'slide' as const,
        duration: 800,
        easing: 'ease-in-out',
      };

      render(
        <AnimationProvider config={customConfig}>
          <TestComponent />
        </AnimationProvider>
      );

      expect(screen.getByTestId('merged-type')).toHaveTextContent('slide');
      expect(screen.getByTestId('merged-duration')).toHaveTextContent('800');
    });

    it('should handle explicit disabled prop', () => {
      render(
        <AnimationProvider disabled={true}>
          <TestComponent />
        </AnimationProvider>
      );

      expect(screen.getByTestId('global-disabled')).toHaveTextContent('true');
      expect(screen.getByTestId('is-disabled')).toHaveTextContent('true');
    });

    it('should respect motion preferences when enabled', () => {
      mockShouldReduceMotion.mockReturnValue(true);

      render(
        <AnimationProvider respectMotionPreferences={true}>
          <TestComponent />
        </AnimationProvider>
      );

      expect(screen.getByTestId('global-disabled')).toHaveTextContent('true');
      expect(screen.getByTestId('is-disabled')).toHaveTextContent('true');
    });

    it('should ignore motion preferences when disabled', () => {
      mockShouldReduceMotion.mockReturnValue(true);

      render(
        <AnimationProvider respectMotionPreferences={false}>
          <TestComponent />
        </AnimationProvider>
      );

      expect(screen.getByTestId('global-disabled')).toHaveTextContent('false');
      expect(screen.getByTestId('respect-motion')).toHaveTextContent('false');
    });

    it('should prioritize explicit disabled over motion preferences', () => {
      mockShouldReduceMotion.mockReturnValue(false);

      render(
        <AnimationProvider disabled={true} respectMotionPreferences={true}>
          <TestComponent />
        </AnimationProvider>
      );

      expect(screen.getByTestId('global-disabled')).toHaveTextContent('true');
      expect(screen.getByTestId('is-disabled')).toHaveTextContent('true');
    });
  });

  describe('useAnimationContext', () => {
    it('should return null when used outside provider', () => {
      render(<TestComponent />);

      expect(screen.getByTestId('context-exists')).toHaveTextContent('false');
    });

    it('should return context when used inside provider', () => {
      render(
        <AnimationProvider>
          <TestComponent />
        </AnimationProvider>
      );

      expect(screen.getByTestId('context-exists')).toHaveTextContent('true');
    });
  });

  describe('useMergedAnimationConfig', () => {
    it('should use normalized config when no context', () => {
      const localConfig = { type: 'zoom' as const };

      render(<TestComponent localConfig={localConfig} />);

      expect(mockNormalizeAnimationConfig).toHaveBeenCalledWith(localConfig);
    });

    it('should merge global and local config with local precedence', () => {
      const globalConfig = {
        type: 'fade' as const,
        duration: 600,
        easing: 'ease',
      };

      const localConfig = {
        type: 'slide' as const,
        duration: 800,
      };

      render(
        <AnimationProvider config={globalConfig}>
          <TestComponent localConfig={localConfig} />
        </AnimationProvider>
      );

      // Local config should take precedence
      expect(screen.getByTestId('merged-type')).toHaveTextContent('slide');
      expect(screen.getByTestId('merged-duration')).toHaveTextContent('800');
    });

    it('should use global config when local config is empty', () => {
      const globalConfig = {
        type: 'zoom' as const,
        duration: 1000,
      };

      render(
        <AnimationProvider config={globalConfig}>
          <TestComponent localConfig={{}} />
        </AnimationProvider>
      );

      expect(screen.getByTestId('merged-type')).toHaveTextContent('zoom');
      expect(screen.getByTestId('merged-duration')).toHaveTextContent('1000');
    });
  });

  describe('useAnimationDisabled', () => {
    it('should check motion preferences when no context', () => {
      mockShouldReduceMotion.mockReturnValue(true);

      render(<TestComponent />);

      expect(screen.getByTestId('is-disabled')).toHaveTextContent('true');
      expect(mockShouldReduceMotion).toHaveBeenCalled();
    });

    it('should use context disabled state when available', () => {
      render(
        <AnimationProvider disabled={true}>
          <TestComponent />
        </AnimationProvider>
      );

      expect(screen.getByTestId('is-disabled')).toHaveTextContent('true');
    });

    it('should return false when context is not disabled', () => {
      render(
        <AnimationProvider disabled={false}>
          <TestComponent />
        </AnimationProvider>
      );

      expect(screen.getByTestId('is-disabled')).toHaveTextContent('false');
    });
  });

  describe('context memoization', () => {
    it('should memoize context value to prevent unnecessary re-renders', () => {
      const config = { type: 'fade' as const };

      const { rerender } = render(
        <AnimationProvider config={config}>
          <TestComponent />
        </AnimationProvider>
      );

      const initialType = screen.getByTestId('merged-type').textContent;

      // Re-render with same props
      rerender(
        <AnimationProvider config={config}>
          <TestComponent />
        </AnimationProvider>
      );

      expect(screen.getByTestId('merged-type')).toHaveTextContent(initialType!);
    });

    it('should update context when props change', () => {
      const initialConfig = { type: 'fade' as const };
      const updatedConfig = { type: 'slide' as const };

      const { rerender } = render(
        <AnimationProvider config={initialConfig}>
          <TestComponent />
        </AnimationProvider>
      );

      expect(screen.getByTestId('merged-type')).toHaveTextContent('fade');

      rerender(
        <AnimationProvider config={updatedConfig}>
          <TestComponent />
        </AnimationProvider>
      );

      expect(screen.getByTestId('merged-type')).toHaveTextContent('slide');
    });
  });

  describe('nested providers', () => {
    it('should use the nearest provider context', () => {
      const outerConfig = { type: 'fade' as const, duration: 600 };
      const innerConfig = { type: 'slide' as const, duration: 800 };

      render(
        <AnimationProvider config={outerConfig}>
          <AnimationProvider config={innerConfig}>
            <TestComponent />
          </AnimationProvider>
        </AnimationProvider>
      );

      // Should use inner provider config
      expect(screen.getByTestId('merged-type')).toHaveTextContent('slide');
      expect(screen.getByTestId('merged-duration')).toHaveTextContent('800');
    });

    it('should handle disabled state in nested providers', () => {
      render(
        <AnimationProvider disabled={false}>
          <AnimationProvider disabled={true}>
            <TestComponent />
          </AnimationProvider>
        </AnimationProvider>
      );

      // Inner provider should take precedence
      expect(screen.getByTestId('is-disabled')).toHaveTextContent('true');
    });
  });
});
