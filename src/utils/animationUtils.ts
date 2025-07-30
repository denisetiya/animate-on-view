// Animation validation utilities - zero dependencies, early returns

import {
  AnimationConfig,
  AnimationType,
  AnimationDirection,
  EasingFunction,
} from '../types';
import { AnimationError, ErrorCodes } from '../types/errors';

/**
 * Development-only warning utility
 * Only logs warnings in development mode to avoid production bloat
 */
const devWarn = (message: string, code?: string): void => {
  if (process.env.NODE_ENV === 'development') {
    const fullMessage = code ? `[${code}] ${message}` : message;
    console.warn(`React Scroll Animation: ${fullMessage}`);
  }
};

/**
 * Development-only error utility
 * Provides helpful error messages in development
 */
const devError = (message: string, code: string): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`React Scroll Animation [${code}]: ${message}`);
  }
};

/**
 * Validates animation duration with early return and helpful warnings
 * Range: 100-3000ms as per requirements
 */
export const validateDuration = (duration: number): boolean => {
  if (typeof duration !== 'number' || isNaN(duration)) {
    devWarn(
      `Duration must be a number, got: ${typeof duration}`,
      ErrorCodes.INVALID_DURATION
    );
    return false;
  }

  if (duration < 100) {
    devWarn(
      `Duration ${duration}ms is too short. Minimum is 100ms for smooth animations.`,
      ErrorCodes.INVALID_DURATION
    );
    return false;
  }

  if (duration > 3000) {
    devWarn(
      `Duration ${duration}ms is too long. Maximum is 3000ms to avoid poor UX.`,
      ErrorCodes.INVALID_DURATION
    );
    return false;
  }

  return true;
};

/**
 * Validates animation delay with early return and helpful warnings
 * Range: 0-2000ms as per requirements
 */
export const validateDelay = (delay: number): boolean => {
  if (typeof delay !== 'number' || isNaN(delay)) {
    devWarn(
      `Delay must be a number, got: ${typeof delay}`,
      ErrorCodes.INVALID_DELAY
    );
    return false;
  }

  if (delay < 0) {
    devWarn(
      `Delay cannot be negative, got: ${delay}ms`,
      ErrorCodes.INVALID_DELAY
    );
    return false;
  }

  if (delay > 2000) {
    devWarn(
      `Delay ${delay}ms is too long. Maximum is 2000ms to avoid poor UX.`,
      ErrorCodes.INVALID_DELAY
    );
    return false;
  }

  return true;
};

/**
 * Validates animation offset with helpful warnings
 * Must be a valid number
 */
export const validateOffset = (offset: number): boolean => {
  if (typeof offset !== 'number' || isNaN(offset)) {
    devWarn(
      `Offset must be a number, got: ${typeof offset}`,
      ErrorCodes.INVALID_OFFSET
    );
    return false;
  }

  if (Math.abs(offset) > 1000) {
    devWarn(
      `Large offset value (${offset}px) may cause animations to trigger too early/late`,
      ErrorCodes.INVALID_OFFSET
    );
  }

  return true;
};

/**
 * Validates animation type with helpful suggestions
 * Must be one of the supported types
 */
export const validateAnimationType = (type: AnimationType): boolean => {
  const validTypes: AnimationType[] = ['fade', 'slide', 'zoom', 'flip'];

  if (validTypes.indexOf(type) === -1) {
    devWarn(
      `Invalid animation type: "${type}". Valid types are: ${validTypes.join(', ')}`,
      ErrorCodes.UNSUPPORTED_ANIMATION
    );
    return false;
  }

  return true;
};

/**
 * Validates animation direction with context-aware warnings
 * Must be one of the supported directions
 */
export const validateAnimationDirection = (
  direction: AnimationDirection,
  type?: AnimationType
): boolean => {
  const validDirections: AnimationDirection[] = ['up', 'down', 'left', 'right'];

  if (validDirections.indexOf(direction) === -1) {
    devWarn(
      `Invalid animation direction: "${direction}". Valid directions are: ${validDirections.join(', ')}`,
      ErrorCodes.INVALID_CONFIG
    );
    return false;
  }

  // Context-aware warnings for specific animation types
  if (type === 'fade') {
    devWarn(
      `Direction "${direction}" has no effect on fade animations`,
      ErrorCodes.INVALID_CONFIG
    );
  }

  return true;
};

/**
 * Validates easing function with detailed feedback
 * Supports built-in CSS easing functions and custom cubic-bezier
 */
export const validateEasing = (easing: EasingFunction): boolean => {
  const builtInEasing = [
    'ease',
    'ease-in',
    'ease-out',
    'ease-in-out',
    'linear',
  ];

  // Early return for built-in easing
  if (builtInEasing.indexOf(easing) !== -1) return true;

  // Validate cubic-bezier format
  if (easing.indexOf('cubic-bezier(') === 0) {
    if (easing.indexOf(')', easing.length - 1) === -1) {
      devWarn(
        `Malformed cubic-bezier function: "${easing}". Expected format: cubic-bezier(x1, y1, x2, y2)`,
        ErrorCodes.INVALID_CONFIG
      );
      return false;
    }

    // Extract and validate cubic-bezier values
    const values = easing
      .slice(13, -1)
      .split(',')
      .map(v => parseFloat(v.trim()));
    if (values.length !== 4 || values.some(v => isNaN(v))) {
      devWarn(
        `Invalid cubic-bezier values: "${easing}". All four values must be numbers.`,
        ErrorCodes.INVALID_CONFIG
      );
      return false;
    }

    // Warn about potentially problematic values
    if (values[0] < 0 || values[0] > 1 || values[2] < 0 || values[2] > 1) {
      devWarn(
        `Cubic-bezier x values should be between 0 and 1 for predictable results: "${easing}"`,
        ErrorCodes.INVALID_CONFIG
      );
    }

    return true;
  }

  // Check for other CSS timing functions
  const otherValidEasing = ['steps(', 'frames('];
  if (otherValidEasing.some(prefix => easing.indexOf(prefix) === 0)) {
    return true;
  }

  devWarn(
    `Invalid easing function: "${easing}". Use built-in values (${builtInEasing.join(', ')}) or cubic-bezier()`,
    ErrorCodes.INVALID_CONFIG
  );
  return false;
};

/**
 * Validates complete animation configuration with context-aware checks
 * Uses early returns for maximum performance
 */
export const validateAnimationConfig = (config: AnimationConfig): void => {
  // Validate required type
  if (!validateAnimationType(config.type)) {
    throw new AnimationError(
      `Invalid animation type: ${config.type}`,
      ErrorCodes.UNSUPPORTED_ANIMATION
    );
  }

  // Validate optional direction with context
  if (
    config.direction &&
    !validateAnimationDirection(config.direction, config.type)
  ) {
    throw new AnimationError(
      `Invalid animation direction: ${config.direction}`,
      ErrorCodes.INVALID_CONFIG
    );
  }

  // Validate duration if provided
  if (config.duration !== undefined && !validateDuration(config.duration)) {
    throw new AnimationError(
      `Duration must be between 100-3000ms, got: ${config.duration}`,
      ErrorCodes.INVALID_DURATION
    );
  }

  // Validate delay if provided
  if (config.delay !== undefined && !validateDelay(config.delay)) {
    throw new AnimationError(
      `Delay must be between 0-2000ms, got: ${config.delay}`,
      ErrorCodes.INVALID_DELAY
    );
  }

  // Validate offset if provided
  if (config.offset !== undefined && !validateOffset(config.offset)) {
    throw new AnimationError(
      `Invalid offset value: ${config.offset}`,
      ErrorCodes.INVALID_OFFSET
    );
  }

  // Validate easing if provided
  if (config.easing && !validateEasing(config.easing)) {
    throw new AnimationError(
      `Invalid easing function: ${config.easing}`,
      ErrorCodes.INVALID_CONFIG
    );
  }

  // Additional context-aware validations
  if (config.mirror && config.once) {
    devWarn(
      'Mirror effect is ignored when "once" is true. Set once=false to enable mirror animations.',
      ErrorCodes.INVALID_CONFIG
    );
  }

  if (config.delay && config.delay > 1000) {
    devWarn(
      `Long delay (${config.delay}ms) may negatively impact user experience`,
      ErrorCodes.INVALID_DELAY
    );
  }
};

/**
 * Normalizes animation configuration with defaults and graceful fallbacks
 * Handles invalid values by falling back to safe defaults
 */
export const normalizeAnimationConfig = (
  config: Partial<AnimationConfig>
): AnimationConfig => {
  // Normalize type with fallback
  let normalizedType: AnimationType = 'fade';
  if (config.type && validateAnimationType(config.type)) {
    normalizedType = config.type;
  } else if (config.type) {
    devWarn(
      `Invalid animation type "${config.type}", falling back to "fade"`,
      ErrorCodes.UNSUPPORTED_ANIMATION
    );
  }

  // Normalize direction with context-aware validation
  let normalizedDirection = config.direction;
  if (
    config.direction &&
    !validateAnimationDirection(config.direction, normalizedType)
  ) {
    devWarn(
      `Invalid direction "${config.direction}" for type "${normalizedType}", ignoring direction`,
      ErrorCodes.INVALID_CONFIG
    );
    normalizedDirection = undefined;
  }

  // Normalize duration with bounds checking
  let normalizedDuration = config.duration ?? 600;
  if (config.duration !== undefined && !validateDuration(config.duration)) {
    normalizedDuration = Math.max(100, Math.min(3000, config.duration || 600));
    devWarn(
      `Invalid duration, clamped to ${normalizedDuration}ms`,
      ErrorCodes.INVALID_DURATION
    );
  }

  // Normalize delay with bounds checking
  let normalizedDelay = config.delay ?? 0;
  if (config.delay !== undefined && !validateDelay(config.delay)) {
    normalizedDelay = Math.max(0, Math.min(2000, config.delay || 0));
    devWarn(
      `Invalid delay, clamped to ${normalizedDelay}ms`,
      ErrorCodes.INVALID_DELAY
    );
  }

  // Normalize easing with fallback
  let normalizedEasing = config.easing ?? 'ease';
  if (config.easing && !validateEasing(config.easing)) {
    normalizedEasing = 'ease';
    devWarn(
      `Invalid easing "${config.easing}", falling back to "ease"`,
      ErrorCodes.INVALID_CONFIG
    );
  }

  // Normalize offset with validation
  let normalizedOffset = config.offset ?? 0;
  if (config.offset !== undefined && !validateOffset(config.offset)) {
    normalizedOffset = 0;
    devWarn(`Invalid offset, falling back to 0`, ErrorCodes.INVALID_OFFSET);
  }

  return {
    type: normalizedType,
    direction: normalizedDirection,
    duration: normalizedDuration,
    delay: normalizedDelay,
    easing: normalizedEasing,
    offset: normalizedOffset,
    once: config.once ?? true,
    mirror: config.mirror ?? false,
  };
};

/**
 * Checks if the current browser supports required features
 * Returns compatibility information for graceful fallbacks
 */
export const checkBrowserCompatibility = () => {
  const compatibility = {
    intersectionObserver: false,
    cssTransforms: false,
    cssTransitions: false,
    reducedMotion: false,
  };

  if (typeof window === 'undefined') {
    return compatibility;
  }

  try {
    // Check for Intersection Observer support
    compatibility.intersectionObserver = 'IntersectionObserver' in window;

    // Check for CSS transforms support
    const testElement = document.createElement('div');
    compatibility.cssTransforms =
      'transform' in testElement.style ||
      'webkitTransform' in testElement.style ||
      'mozTransform' in testElement.style;

    // Check for CSS transitions support
    compatibility.cssTransitions =
      'transition' in testElement.style ||
      'webkitTransition' in testElement.style ||
      'mozTransition' in testElement.style;

    // Check for reduced motion support
    compatibility.reducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion)').matches !== undefined;
  } catch {
    devError(
      'Error checking browser compatibility',
      ErrorCodes.OBSERVER_NOT_SUPPORTED
    );
  }

  return compatibility;
};

/**
 * Validates element for animation
 * Ensures element is valid and can be animated
 */
export const validateElement = (element: HTMLElement | null): boolean => {
  if (!element) {
    devWarn(
      'Animation target element is null or undefined',
      ErrorCodes.INVALID_ELEMENT
    );
    return false;
  }

  if (!(element instanceof HTMLElement)) {
    devWarn(
      'Animation target must be an HTMLElement',
      ErrorCodes.INVALID_ELEMENT
    );
    return false;
  }

  // Check if element is connected to DOM
  if (!element.isConnected) {
    devWarn(
      'Animation target element is not connected to the DOM',
      ErrorCodes.INVALID_ELEMENT
    );
    return false;
  }

  return true;
};
