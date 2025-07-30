// Main scroll animation hook implementation - Ultra-optimized with ref caching
import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import {
  AnimationConfig,
  UseScrollAnimationReturn,
  AnimationCallback,
} from '../types';
import { useIntersectionObserver } from './useIntersectionObserver';
import {
  getAnimationStyles,
  createCompleteAnimationStyles,
} from '../animations';
import {
  normalizeAnimationConfig,
  validateAnimationConfig,
  validateElement,
} from '../utils/animationUtils';
import { shouldReduceMotion, isSSR } from '../utils/motionUtils';
import {
  getSSRSafeInitialState,
  createSSRSafeHandler,
  useEnhancedHydration,
} from '../utils/ssrUtils';
import { performanceMonitor, optimizedRAF } from '../utils/performanceUtils';

/**
 * Main scroll animation hook with comprehensive state management
 * Combines intersection observation with animation lifecycle management
 */
export const useScrollAnimation = (
  config: AnimationConfig,
  callbacks?: {
    onStart?: AnimationCallback;
    onEnd?: AnimationCallback;
  }
): UseScrollAnimationReturn => {
  // Normalize and validate configuration with comprehensive error handling
  const normalizedConfig = useMemo(() => {
    try {
      const normalized = normalizeAnimationConfig(config);
      validateAnimationConfig(normalized);
      return normalized;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          'useScrollAnimation: Invalid configuration, using safe defaults:',
          error
        );
      }
      // Return safe fallback configuration
      return normalizeAnimationConfig({ type: 'fade' });
    }
  }, [config]);

  // Enhanced hydration tracking for better SSR compatibility
  const { isHydrated, isHydrating } = useEnhancedHydration();

  // Use SSR-safe initial state to prevent hydration mismatches
  const ssrSafeState = getSSRSafeInitialState();
  const [isVisible, setIsVisible] = useState(ssrSafeState.isVisible);
  const [isAnimating, setIsAnimating] = useState(ssrSafeState.isAnimating);
  const [hasAnimated, setHasAnimated] = useState(ssrSafeState.hasAnimated);
  const animationTimeoutRef = useRef<number | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  // Memoize motion disabled check to prevent unnecessary recalculations
  const motionDisabled = useMemo(
    () => shouldReduceMotion() || isHydrating || !isHydrated,
    [isHydrating, isHydrated]
  );

  // Memoize intersection observer options to prevent unnecessary re-observations
  const observerOptions = useMemo(
    () => ({
      threshold: 0.1,
      rootMargin: normalizedConfig.offset
        ? `${normalizedConfig.offset}px`
        : '0px',
      once: normalizedConfig.once,
      disabled: motionDisabled,
    }),
    [normalizedConfig.offset, normalizedConfig.once, motionDisabled]
  );

  // Use intersection observer for viewport detection
  const { ref: intersectionRef, isIntersecting } =
    useIntersectionObserver(observerOptions);

  // Optimized ref synchronization with minimal re-creation
  const ref = useCallback(
    (element: HTMLElement | null) => {
      // Cache element reference to minimize DOM queries
      elementRef.current = element;
      intersectionRef.current = element;
    },
    [intersectionRef]
  );

  // Ultra-optimized animation trigger with performance monitoring and ref caching
  const trigger = useCallback(() => {
    const safeHandler = createSSRSafeHandler(() => {
      // Use cached element reference to minimize DOM queries
      const element = elementRef.current;

      // Validate element before proceeding
      if (
        !element ||
        !validateElement(element) ||
        isAnimating ||
        motionDisabled ||
        isSSR()
      )
        return;

      // Skip if already animated and once is true
      if (hasAnimated && normalizedConfig.once) return;

      performanceMonitor.mark('animation-trigger-start');

      setIsAnimating(true);
      setIsVisible(true);

      // Call onStart callback
      if (callbacks?.onStart) {
        callbacks.onStart(element);
      }

      // Apply initial styles immediately with GPU acceleration
      const initialStyles = getAnimationStyles(
        normalizedConfig.type,
        normalizedConfig.direction,
        'initial'
      );

      // Batch style application for better performance
      Object.assign(element.style, initialStyles);

      // Apply animated styles with optimized RAF timing
      optimizedRAF(() => {
        if (!element) return; // Additional safety check inside RAF

        const animatedStyles = createCompleteAnimationStyles(
          normalizedConfig.type,
          normalizedConfig.direction,
          'animate',
          normalizedConfig.duration,
          normalizedConfig.delay,
          normalizedConfig.easing
        );
        Object.assign(element.style, animatedStyles);

        performanceMonitor.mark('animation-trigger-end');
        performanceMonitor.measureBetween(
          'animation-trigger',
          'animation-trigger-start',
          'animation-trigger-end'
        );
      });

      // Set timeout for animation completion with cleanup
      const totalDuration =
        (normalizedConfig.duration || 600) + (normalizedConfig.delay || 0);
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        setHasAnimated(true);

        // Call onEnd callback
        if (callbacks?.onEnd && element) {
          callbacks.onEnd(element);
        }

        // Clean up transition styles and GPU acceleration hints
        if (element && element.style.transition) {
          element.style.transition = '';
        }

        // Clean up will-change for memory efficiency
        if (
          element &&
          element.style.willChange &&
          element.style.willChange !== 'auto'
        ) {
          element.style.willChange = 'auto';
        }
      }, totalDuration) as unknown as number;
    });

    safeHandler();
  }, [normalizedConfig, callbacks, isAnimating, hasAnimated, motionDisabled]);

  // Animation reset function
  const reset = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    // Clear any pending animation timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    // Reset state
    setIsVisible(false);
    setIsAnimating(false);
    setHasAnimated(false);

    // Apply initial styles
    const initialStyles = getAnimationStyles(
      normalizedConfig.type,
      normalizedConfig.direction,
      'initial'
    );
    Object.assign(element.style, initialStyles);

    // Remove transition
    element.style.transition = '';
  }, [normalizedConfig]);

  // Handle intersection changes
  useEffect(() => {
    if (motionDisabled) return;

    if (isIntersecting && !isVisible && !isAnimating) {
      // Element entered viewport - trigger animation
      trigger();
    } else if (
      !isIntersecting &&
      isVisible &&
      normalizedConfig.mirror &&
      !normalizedConfig.once
    ) {
      // Element left viewport with mirror enabled - reset animation
      reset();
    }
  }, [
    isIntersecting,
    isVisible,
    isAnimating,
    normalizedConfig.mirror,
    normalizedConfig.once,
    motionDisabled,
    trigger,
    reset,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // If motion is disabled, return static state
  if (motionDisabled) {
    return {
      ref,
      isVisible: true, // Show content immediately when motion is disabled
      isAnimating: false,
      trigger: () => {}, // No-op when motion is disabled
      reset: () => {}, // No-op when motion is disabled
    };
  }

  return {
    ref,
    isVisible,
    isAnimating,
    trigger,
    reset,
  };
};
