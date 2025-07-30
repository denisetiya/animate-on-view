// Viewport utilities - zero dependencies, minimal math operations

import { ViewportInfo, ElementPosition } from '../types';

/**
 * Gets viewport information with minimal calculations
 * Single object creation for performance
 */
export const getViewportInfo = (): ViewportInfo => {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0, scrollY: 0, scrollX: 0 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    scrollY: window.scrollY,
    scrollX: window.scrollX,
  };
};

/**
 * Gets element position relative to viewport
 * Uses getBoundingClientRect for accuracy and performance
 */
export const getElementPosition = (element: HTMLElement): ElementPosition => {
  const rect = element.getBoundingClientRect();

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    bottom: rect.bottom,
    right: rect.right,
  };
};

/**
 * Calculates if element is in viewport with offset
 * Minimal math operations, early returns
 */
export const isElementInViewport = (
  element: HTMLElement,
  offset: number = 0
): boolean => {
  const rect = element.getBoundingClientRect();
  const viewport = getViewportInfo();

  // Early return if element is completely above viewport
  if (rect.bottom < -offset) return false;

  // Early return if element is completely below viewport
  if (rect.top > viewport.height + offset) return false;

  // Early return if element is completely to the left
  if (rect.right < -offset) return false;

  // Early return if element is completely to the right
  if (rect.left > viewport.width + offset) return false;

  return true;
};

/**
 * Calculates intersection ratio with minimal math
 * Returns value between 0 and 1
 */
export const calculateIntersectionRatio = (element: HTMLElement): number => {
  const rect = element.getBoundingClientRect();
  const viewport = getViewportInfo();

  // Calculate visible area
  const visibleTop = Math.max(0, rect.top);
  const visibleBottom = Math.min(viewport.height, rect.bottom);
  const visibleLeft = Math.max(0, rect.left);
  const visibleRight = Math.min(viewport.width, rect.right);

  // Early return if no intersection
  if (visibleTop >= visibleBottom || visibleLeft >= visibleRight) return 0;

  const visibleArea =
    (visibleBottom - visibleTop) * (visibleRight - visibleLeft);
  const totalArea = rect.width * rect.height;

  return totalArea > 0 ? visibleArea / totalArea : 0;
};

/**
 * Converts offset pixels to rootMargin string
 * Minimal string operations
 */
export const offsetToRootMargin = (offset: number): string => {
  return `${offset}px`;
};

/**
 * Creates rootMargin string for all sides with offset
 * Optimized for IntersectionObserver rootMargin format
 */
export const createRootMargin = (offset: number): string => {
  return `${offset}px ${offset}px ${offset}px ${offset}px`;
};

/**
 * Calculates if element should trigger animation based on offset
 * Used for viewport detection with custom offset values
 */
export const shouldTriggerAnimation = (
  entry: IntersectionObserverEntry,
  offset: number = 0
): boolean => {
  // Early return if not intersecting
  if (!entry.isIntersecting) return false;

  // If no offset, simple intersection check
  if (offset === 0) return true;

  // Calculate if element has crossed the offset threshold
  const rect = entry.boundingClientRect;
  const rootBounds = entry.rootBounds;

  if (!rootBounds) return entry.isIntersecting;

  // Check if element has moved past the offset threshold
  const hasPassedTopOffset = rect.top <= rootBounds.bottom - offset;
  const hasPassedBottomOffset = rect.bottom >= rootBounds.top + offset;

  return hasPassedTopOffset && hasPassedBottomOffset;
};

/**
 * Calculates optimal threshold values for smooth animation triggers
 * Returns array of threshold values for IntersectionObserver
 */
export const calculateThresholds = (steps: number = 10): number[] => {
  const thresholds: number[] = [];

  // Add threshold values from 0 to 1 in equal steps
  for (let i = 0; i <= steps; i++) {
    thresholds.push(i / steps);
  }

  return thresholds;
};

/**
 * Calculates single threshold based on element height and desired trigger point
 * Optimized for elements of different sizes
 */
export const calculateElementThreshold = (
  element: HTMLElement,
  triggerPoint: number = 0.1
): number => {
  const rect = element.getBoundingClientRect();
  const viewport = getViewportInfo();

  // For very small elements, use a lower threshold
  if (rect.height < viewport.height * 0.1) {
    return 0.1;
  }

  // For very large elements, use a higher threshold
  if (rect.height > viewport.height * 0.8) {
    return 0.8;
  }

  // Default threshold based on trigger point
  return Math.max(0.1, Math.min(0.9, triggerPoint));
};

/**
 * Determines if animation should trigger based on intersection ratio
 * Smooth triggering with hysteresis to prevent flickering
 */
export const shouldTriggerWithThreshold = (
  intersectionRatio: number,
  threshold: number = 0.1,
  wasVisible: boolean = false
): boolean => {
  // Hysteresis: different thresholds for entering vs leaving
  const enterThreshold = threshold;
  const exitThreshold = threshold * 0.5; // Lower threshold for exit to prevent flickering

  if (wasVisible) {
    // Element was visible, check if it should remain visible
    return intersectionRatio > exitThreshold;
  } else {
    // Element was not visible, check if it should become visible
    return intersectionRatio > enterThreshold;
  }
};
