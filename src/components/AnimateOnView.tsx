// AnimateOnView component implementation - Ultra-optimized with React.memo
import React, { forwardRef, useMemo, useEffect, memo } from 'react';
import { AnimateOnViewProps } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import {
  useMergedAnimationConfig,
  useAnimationDisabled,
} from '../context/AnimationContext';
import {
  useEnhancedHydration,
  useHydrationSafeAnimation,
} from '../utils/ssrUtils';
import {
  validateAnimationConfig,
  normalizeAnimationConfig,
} from '../utils/animationUtils';
import {
  warnAboutCompatibility,
  getFallbackStrategy,
} from '../utils/browserCompat';

/**
 * AnimateOnView component - Ultra-optimized with React.memo
 * Uses useScrollAnimation hook for animation logic and state management
 */
const AnimateOnViewComponent = forwardRef<HTMLElement, AnimateOnViewProps>(
  (
    {
      children,
      type = 'fade',
      direction,
      duration = 600,
      delay = 0,
      easing = 'ease',
      offset = 0,
      once = true,
      mirror = false,
      className,
      style,
      onAnimationStart,
      onAnimationEnd,
      disabled = false,
      ...restProps
    },
    forwardedRef
  ) => {
    // Track hydration state for SSR compatibility
    const { isHydrating } = useEnhancedHydration();

    // Check browser compatibility and warn in development
    useEffect(() => {
      if (process.env.NODE_ENV === 'development') {
        warnAboutCompatibility();
      }
    }, []);

    // Validate and normalize configuration with error handling
    const validatedConfig = useMemo(() => {
      try {
        const config = normalizeAnimationConfig({
          type,
          direction,
          duration,
          delay,
          easing,
          offset,
          once,
          mirror,
        });

        // Validate the normalized config
        validateAnimationConfig(config);
        return config;
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('AnimateOnView configuration error:', error);
        }

        // Return safe fallback configuration
        return normalizeAnimationConfig({ type: 'fade' });
      }
    }, [type, direction, duration, delay, easing, offset, once, mirror]);

    // Check browser compatibility for fallback strategy
    const fallbackStrategy = useMemo(() => getFallbackStrategy(), []);

    // Check if animations should be disabled (context-aware)
    const globalDisabled = useAnimationDisabled();
    const isDisabled =
      disabled ||
      globalDisabled ||
      isHydrating ||
      fallbackStrategy.strategy === 'static';

    // Merge global and local configuration using validated config
    const animationConfig = useMergedAnimationConfig(validatedConfig);

    // Memoize callbacks to prevent unnecessary re-renders
    const callbacks = useMemo(
      () => ({
        onStart: onAnimationStart,
        onEnd: onAnimationEnd,
      }),
      [onAnimationStart, onAnimationEnd]
    );

    // Use scroll animation hook for animation logic
    const {
      ref: animationRef,
      isVisible,
      isAnimating,
    } = useScrollAnimation(animationConfig, callbacks);

    // Use hydration-safe animation state to prevent mismatches
    const safeIsVisible = useHydrationSafeAnimation(false, isVisible, [
      isVisible,
    ]);
    const safeIsAnimating = useHydrationSafeAnimation(false, isAnimating, [
      isAnimating,
    ]);

    // Handle ref forwarding - combine animation ref with forwarded ref
    const handleRef = React.useCallback(
      (element: HTMLElement | null) => {
        // Set animation ref
        if (typeof animationRef === 'function') {
          animationRef(element);
        } else if (animationRef && 'current' in animationRef) {
          animationRef.current = element;
        }

        // Set forwarded ref
        if (forwardedRef) {
          if (typeof forwardedRef === 'function') {
            forwardedRef(element);
          } else if ('current' in forwardedRef) {
            forwardedRef.current = element;
          }
        }
      },
      [animationRef, forwardedRef]
    );

    // Combine class names
    const combinedClassName = useMemo(() => {
      const classes = [];

      if (className) {
        classes.push(className);
      }

      // Add animation state classes for styling hooks
      if (!isDisabled) {
        classes.push('animate-on-view');
        classes.push(`animate-on-view--${type}`);

        if (direction) {
          classes.push(`animate-on-view--${type}-${direction}`);
        }

        if (safeIsVisible) {
          classes.push('animate-on-view--visible');
        }

        if (safeIsAnimating) {
          classes.push('animate-on-view--animating');
        }
      }

      return classes.length > 0 ? classes.join(' ') : undefined;
    }, [
      className,
      type,
      direction,
      safeIsVisible,
      safeIsAnimating,
      isDisabled,
    ]);

    // If disabled, render children without animation
    if (isDisabled) {
      return (
        <div ref={handleRef} className={className} style={style} {...restProps}>
          {children}
        </div>
      );
    }

    // Render with animation
    return (
      <div
        ref={handleRef}
        className={combinedClassName}
        style={style}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

// Set display name for debugging
AnimateOnViewComponent.displayName = 'AnimateOnView';

/**
 * Memoized AnimateOnView component for performance optimization
 * Prevents unnecessary re-renders when props haven't changed
 */
export const AnimateOnView = memo(
  AnimateOnViewComponent,
  (prevProps, nextProps) => {
    // Custom comparison function for optimal re-render prevention
    return (
      prevProps.type === nextProps.type &&
      prevProps.direction === nextProps.direction &&
      prevProps.duration === nextProps.duration &&
      prevProps.delay === nextProps.delay &&
      prevProps.easing === nextProps.easing &&
      prevProps.offset === nextProps.offset &&
      prevProps.once === nextProps.once &&
      prevProps.mirror === nextProps.mirror &&
      prevProps.disabled === nextProps.disabled &&
      prevProps.className === nextProps.className &&
      prevProps.onAnimationStart === nextProps.onAnimationStart &&
      prevProps.onAnimationEnd === nextProps.onAnimationEnd &&
      // Deep comparison for style object
      JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style) &&
      // Children comparison (shallow)
      prevProps.children === nextProps.children
    );
  }
);
