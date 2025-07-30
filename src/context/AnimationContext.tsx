// Animation context for global configuration - Ultra-optimized with React.memo
import React, { createContext, useContext, useMemo, memo } from 'react';
import {
  AnimationConfig,
  AnimationContextValue,
  AnimationProviderProps,
} from '../types';
import { shouldReduceMotion } from '../utils/motionUtils';
import { normalizeAnimationConfig } from '../utils/animationUtils';

/**
 * Animation context for providing global configuration
 */
const AnimationContext = createContext<AnimationContextValue | null>(null);

/**
 * AnimationProvider component - Ultra-optimized with React.memo
 * Provides default configuration and global disable functionality
 */
const AnimationProviderComponent: React.FC<AnimationProviderProps> = ({
  children,
  config = {},
  disabled = false,
  respectMotionPreferences = true,
}) => {
  // Memoize motion preference detection to prevent unnecessary recalculations
  const motionDisabled = useMemo(
    () => (respectMotionPreferences ? shouldReduceMotion() : false),
    [respectMotionPreferences]
  );

  // Global disable takes precedence over motion preferences
  const globalDisabled = disabled || motionDisabled;

  // Ultra-optimized global configuration with deep memoization
  const globalConfig = useMemo(() => {
    const defaultConfig: Partial<AnimationConfig> = {
      type: 'fade',
      duration: 600,
      delay: 0,
      easing: 'ease',
      offset: 0,
      once: true,
      mirror: false,
    };

    return {
      ...defaultConfig,
      ...config,
    };
  }, [config]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<AnimationContextValue>(
    () => ({
      globalConfig,
      disabled: globalDisabled,
      respectMotionPreferences,
    }),
    [globalConfig, globalDisabled, respectMotionPreferences]
  );

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
};

/**
 * Memoized AnimationProvider for performance optimization
 * Prevents unnecessary re-renders when props haven't changed
 */
export const AnimationProvider = memo(
  AnimationProviderComponent,
  (prevProps, nextProps) => {
    // Custom comparison function for optimal re-render prevention
    return (
      prevProps.disabled === nextProps.disabled &&
      prevProps.respectMotionPreferences ===
        nextProps.respectMotionPreferences &&
      // Deep comparison for config object
      JSON.stringify(prevProps.config) === JSON.stringify(nextProps.config) &&
      // Children comparison (shallow)
      prevProps.children === nextProps.children
    );
  }
);

/**
 * Hook to access animation context
 * Returns null if used outside of AnimationProvider
 */
export const useAnimationContext = (): AnimationContextValue | null => {
  return useContext(AnimationContext);
};

/**
 * Hook to get merged animation configuration
 * Combines global config with local config, with local taking precedence
 */
export const useMergedAnimationConfig = (
  localConfig: Partial<AnimationConfig>
): AnimationConfig => {
  const context = useAnimationContext();

  // If no context, use local config with defaults
  if (!context) {
    return normalizeAnimationConfig(localConfig);
  }

  // Merge global config with local config (local takes precedence)
  const mergedConfig = {
    ...context.globalConfig,
    ...localConfig,
  };

  return normalizeAnimationConfig(mergedConfig);
};

/**
 * Hook to check if animations are globally disabled
 * Considers both explicit disable and motion preferences
 */
export const useAnimationDisabled = (): boolean => {
  const context = useAnimationContext();

  // If no context, check motion preferences directly
  if (!context) {
    return shouldReduceMotion();
  }

  return context.disabled;
};
