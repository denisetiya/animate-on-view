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
  
  export const createStyleString = (styles: Record<string, any>): string => {
    return Object.entries(styles)
      .map(([key, value]) => {
        const cssKey = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
        return `${cssKey}: ${value}`;
      })
      .join('; ');
  };