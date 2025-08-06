/**
 * @copyright 2025 denisetiya
 * @license MIT
 */

export const createTransitionString = (
    duration: number,
    delay: number,
    easing: string
  ): string => {
    const properties = ['opacity', 'transform'];
    return properties
      .map(prop => `${prop} ${duration}ms ${easing} ${delay}ms`)
      .join(', ');
  };
  
  export const mergeStyles = (
    baseStyle: React.CSSProperties,
    userStyle?: React.CSSProperties
  ): React.CSSProperties => ({
    ...baseStyle,
    ...userStyle,
  });