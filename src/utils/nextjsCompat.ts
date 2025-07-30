// Next.js specific compatibility utilities
import React, {
  useEffect,
  useState,
  ComponentType,
  createElement,
} from 'react';
import { AnimateOnViewProps } from '../types';
import { AnimateOnView } from '@/components';
import { nextjsUtils, ClientOnly } from './ssrUtils';

/**
 * Next.js compatible AnimateOnView component
 * Handles Next.js specific hydration patterns and SSR requirements
 */
export const NextJSAnimateOnView: React.FC<AnimateOnViewProps> = props => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render animations on server or before hydration in Next.js
  if (!isMounted) {
    return React.createElement(
      'div',
      {
        className: props.className,
        style: props.style,
      },
      props.children
    );
  }

  return createElement(AnimateOnView, props);
};

NextJSAnimateOnView.displayName = 'NextJSAnimateOnView';

/**
 * Higher-order component for Next.js compatibility
 * Wraps any animation component to make it Next.js compatible
 */
export const withNextJSCompat = <P extends object>(
  Component: ComponentType<P>
): ComponentType<P> => {
  const NextJSCompatComponent = (props: P) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    if (!isClient) {
      return null;
    }

    return createElement(Component, props);
  };

  NextJSCompatComponent.displayName = `withNextJSCompat(${Component.displayName || Component.name || 'Component'})`;

  return NextJSCompatComponent;
};

/**
 * Next.js dynamic import helper for animations
 * Provides a way to dynamically import animation components
 */
export const createDynamicAnimationComponent = <P extends object>(
  componentImport: () => Promise<{ default: ComponentType<P> }>
) => {
  const DynamicComponent = React.lazy(componentImport);

  const WrappedComponent = (props: P) =>
    React.createElement(ClientOnly, {
      fallback: React.createElement('div', { style: { minHeight: '1px' } }),
      children: React.createElement(
        React.Suspense,
        {
          fallback: React.createElement('div', { style: { minHeight: '1px' } }),
        },
        React.createElement(DynamicComponent, props)
      ),
    });

  WrappedComponent.displayName = 'DynamicAnimationComponent';

  return WrappedComponent;
};

/**
 * Next.js App Router compatibility utilities
 */
export const appRouterUtils = {
  /**
   * Creates a client component wrapper for App Router
   */
  createClientComponent: <P extends object>(Component: ComponentType<P>) => {
    'use client';

    const ClientComponent = (props: P) => {
      return createElement(Component, props);
    };

    ClientComponent.displayName = `ClientComponent(${Component.displayName || Component.name || 'Component'})`;

    return ClientComponent;
  },

  /**
   * Checks if running in App Router environment
   */
  isAppRouter: (): boolean => {
    if (typeof window === 'undefined') return false;

    try {
      // Check for App Router specific indicators
      return !!(
        document.querySelector('[data-nextjs-router="app"]') ||
        (window as unknown as { __NEXT_ROUTER_BASEPATH?: string })
          .__NEXT_ROUTER_BASEPATH !== undefined
      );
    } catch {
      return false;
    }
  },
};

/**
 * Next.js Pages Router compatibility utilities
 */
export const pagesRouterUtils = {
  /**
   * Creates a pages router compatible component
   */
  createPagesComponent: <P extends object>(Component: ComponentType<P>) => {
    const PagesComponent = (props: P) => {
      const [isReady, setIsReady] = useState(false);

      useEffect(() => {
        // Wait for Next.js router to be ready
        const checkRouter = () => {
          if (nextjsUtils.getRouter()) {
            setIsReady(true);
          } else {
            setTimeout(checkRouter, 10);
          }
        };

        checkRouter();
      }, []);

      if (!isReady) {
        return null;
      }

      return createElement(Component, props);
    };

    PagesComponent.displayName = `PagesComponent(${Component.displayName || Component.name || 'Component'})`;

    return PagesComponent;
  },

  /**
   * Checks if running in Pages Router environment
   */
  isPagesRouter: (): boolean => {
    if (typeof window === 'undefined') return false;

    try {
      return !!(nextjsUtils.getRouter() || document.querySelector('#__next'));
    } catch {
      return false;
    }
  },
};

/**
 * Universal Next.js compatibility hook
 * Detects the Next.js environment and provides appropriate utilities
 */
export const useNextJSCompat = () => {
  const [environment, setEnvironment] = useState<'app' | 'pages' | 'none'>(
    'none'
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (appRouterUtils.isAppRouter()) {
      setEnvironment('app');
    } else if (pagesRouterUtils.isPagesRouter()) {
      setEnvironment('pages');
    } else {
      setEnvironment('none');
    }

    setIsReady(true);
  }, []);

  return {
    environment,
    isReady,
    isNextJS: environment !== 'none',
    isAppRouter: environment === 'app',
    isPagesRouter: environment === 'pages',
  };
};

/**
 * Next.js specific animation configuration
 * Provides optimized settings for Next.js applications
 */
export const getNextJSAnimationConfig = () => ({
  // Disable animations during SSR
  disabled: typeof window === 'undefined',
  // Use shorter durations for better perceived performance
  duration: 400,
  delay: 0,
  // Use hardware-accelerated animations
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // Smaller offset for mobile-first approach
  offset: 50,
  // Enable once by default for better performance
  once: true,
  // Disable mirror for better performance
  mirror: false,
});

/**
 * Next.js Image component compatibility
 * Ensures animations work well with Next.js Image component
 */
export const NextJSImageAnimation: React.FC<
  AnimateOnViewProps & {
    imageProps?: Record<string, unknown>;
  }
> = ({ imageProps, children, ...animationProps }) => {
  const enhancedChildren = React.cloneElement(
    children as React.ReactElement<any>,
    {
      ...imageProps,
      onLoad: (e: Event) => {
        // Handle image load event
        if (imageProps?.onLoad) {
          (imageProps.onLoad as (e: Event) => void)(e);
        }
      },
      onError: (e: Event) => {
        // Handle image error event
        if (imageProps?.onError) {
          (imageProps.onError as (e: Event) => void)(e);
        }
      },
    } as any
  );

  return React.createElement(NextJSAnimateOnView, {
    ...animationProps,
    children: enhancedChildren,
  });
};

NextJSImageAnimation.displayName = 'NextJSImageAnimation';

/**
 * Next.js 13+ App Router specific utilities
 * Enhanced support for the new App Router architecture
 */
export const appRouterEnhanced = {
  /**
   * Creates a client component with proper 'use client' directive handling
   */
  withClientDirective: <P extends object>(Component: ComponentType<P>) => {
    const ClientDirectiveComponent = (props: P) => {
      // Ensure this runs only on client side
      const [isClient, setIsClient] = useState(false);

      useEffect(() => {
        setIsClient(true);
      }, []);

      if (!isClient) {
        return null;
      }

      return createElement(Component, props);
    };

    // Add display name for debugging
    ClientDirectiveComponent.displayName = `ClientDirective(${Component.displayName || Component.name || 'Component'})`;

    return ClientDirectiveComponent;
  },

  /**
   * Handles Next.js 13+ streaming and suspense boundaries
   */
  withStreamingSupport: <P extends object>(Component: ComponentType<P>) => {
    const StreamingComponent = (props: P) => {
      return React.createElement(
        React.Suspense,
        {
          fallback: React.createElement('div', {
            style: { minHeight: '1px', opacity: 0 },
          }),
        },
        React.createElement(Component, props)
      );
    };

    StreamingComponent.displayName = `Streaming(${Component.displayName || Component.name || 'Component'})`;

    return StreamingComponent;
  },

  /**
   * Optimized for Next.js 13+ server components
   */
  createServerCompatible: <P extends object>(Component: ComponentType<P>) => {
    const ServerCompatibleComponent = (props: P) => {
      // Return a placeholder for server rendering
      if (typeof window === 'undefined') {
        return React.createElement('div', {
          'data-nextjs-animation-placeholder': true,
          style: { opacity: 0, minHeight: '1px' },
        });
      }

      return createElement(Component, props);
    };

    ServerCompatibleComponent.displayName = `ServerCompatible(${Component.displayName || Component.name || 'Component'})`;

    return ServerCompatibleComponent;
  },
};

/**
 * Next.js middleware compatibility
 * Handles edge runtime and middleware constraints
 */
export const middlewareCompat = {
  /**
   * Checks if running in Next.js edge runtime
   */
  isEdgeRuntime: (): boolean => {
    if (typeof window === 'undefined') {
      try {
        // Check for edge runtime specific globals
        return !!(
          (globalThis as unknown as { EdgeRuntime?: string }).EdgeRuntime ||
          (
            globalThis as unknown as {
              process?: { env?: { NEXT_RUNTIME?: string } };
            }
          ).process?.env?.NEXT_RUNTIME === 'edge'
        );
      } catch {
        return false;
      }
    }
    return false;
  },

  /**
   * Creates edge-runtime safe animation config
   */
  getEdgeSafeConfig: () => ({
    disabled: middlewareCompat.isEdgeRuntime(),
    duration: 0,
    delay: 0,
    useIntersectionObserver: false,
  }),
};

/**
 * Next.js performance optimization utilities
 */
export const nextjsPerformance = {
  /**
   * Preloads animation components for better performance
   */
  preloadAnimations: () => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        // Preload critical animation styles
        const style = document.createElement('style');
        style.textContent = `
          .animate-on-scroll { transition: opacity 0.3s ease, transform 0.3s ease; }
          .animate-on-scroll--fade { opacity: 0; }
          .animate-on-scroll--slide { transform: translateY(20px); }
        `;
        document.head.appendChild(style);
      });
    }
  },

  /**
   * Optimizes animations for Next.js Image component
   */
  optimizeForNextImage: () => ({
    // Reduce animation duration for images to prevent layout shift
    duration: 300,
    // Use transform-based animations only
    type: 'fade' as const,
    // Trigger earlier for images
    offset: 100,
    // Only animate once for better performance
    once: true,
  }),
};

/**
 * Next.js route change handling
 * Manages animations during route transitions
 */
export const routeChangeHandler = {
  /**
   * Resets animations on route change
   */
  setupRouteChangeHandling: () => {
    if (typeof window !== 'undefined') {
      // Listen for Next.js route changes
      const handleRouteChange = () => {
        // Reset all animation states
        const animatedElements =
          document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(element => {
          element.classList.remove('animate-on-scroll--visible');
        });
      };

      // Try to hook into Next.js router events
      try {
        const router = nextjsUtils.getRouter();
        if (router && typeof router === 'object' && 'events' in router) {
          (
            router as {
              events: { on: (event: string, handler: () => void) => void };
            }
          ).events.on('routeChangeStart', handleRouteChange);
        }
      } catch {
        // Fallback to popstate for route changes
        window.addEventListener('popstate', handleRouteChange);
      }

      return () => {
        try {
          const router = nextjsUtils.getRouter();
          if (router && typeof router === 'object' && 'events' in router) {
            (
              router as {
                events: { off: (event: string, handler: () => void) => void };
              }
            ).events.off('routeChangeStart', handleRouteChange);
          }
        } catch {
          window.removeEventListener('popstate', handleRouteChange);
        }
      };
    }

    return () => {};
  },
};
