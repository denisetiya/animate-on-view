/**
 * @copyright 2025 denisetiya
 * @license MIT
 */

export function intersectionObserver(
    element: HTMLElement,
    options: {
      threshold?: number;
      rootMargin?: string;
      triggerOnce?: boolean;
      onIntersect?: (isIntersecting: boolean) => void;
    } = {}
  ) {
    const {
      threshold = 0.1,
      rootMargin = '0px',
      triggerOnce = true,
      onIntersect,
    } = options;
  
    let hasTriggered = false;
  
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isIntersecting = entry.isIntersecting;
  
        if (isIntersecting) {
          hasTriggered = true;
          onIntersect?.(true);
        } else if (!triggerOnce || !hasTriggered) {
          onIntersect?.(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );
  
    observer.observe(element);
  
    return {
      destroy() {
        observer.disconnect();
      },
    };
  }