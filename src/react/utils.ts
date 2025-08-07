/**
 * @copyright 2025 denisetiya
 * @license MIT
 */

export const createTransitionString = (
    duration: number,
    delay: number,
    easing: string
  ): string => `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`;
  
  export const mergeStyles = (
    baseStyle: React.CSSProperties,
    userStyle?: React.CSSProperties
  ): React.CSSProperties => userStyle ? { ...baseStyle, ...userStyle } : baseStyle;