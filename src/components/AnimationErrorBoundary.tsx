// Error boundary component for animation failures
import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AnimationError, ErrorCodes } from '../types/errors';

interface AnimationErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

interface AnimationErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary specifically designed for animation components
 * Provides graceful fallbacks when animations fail
 */
export class AnimationErrorBoundary extends Component<
  AnimationErrorBoundaryProps,
  AnimationErrorBoundaryState
> {
  constructor(props: AnimationErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<AnimationErrorBoundaryState> {
    // Update state to trigger fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Animation Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report animation-specific errors
    if (error instanceof AnimationError) {
      this.reportAnimationError(error);
    }
  }

  componentDidUpdate(prevProps: AnimationErrorBoundaryProps) {
    // Reset error state when props change (if enabled)
    if (
      this.props.resetOnPropsChange &&
      this.state.hasError &&
      prevProps.children !== this.props.children
    ) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }
  }

  private reportAnimationError(error: AnimationError) {
    if (process.env.NODE_ENV === 'development') {
      const suggestions = this.getErrorSuggestions(error.code);
      console.warn(`Animation Error [${error.code}]: ${error.message}`);
      if (suggestions.length > 0) {
        console.info('💡 Suggestions:', suggestions);
      }
    }
  }

  private getErrorSuggestions(errorCode: string): string[] {
    const suggestions: Record<string, string[]> = {
      [ErrorCodes.INVALID_DURATION]: [
        'Use duration between 100-3000ms',
        'Consider 600ms as a good default',
        'Shorter durations feel snappier, longer ones more elegant',
      ],
      [ErrorCodes.INVALID_DELAY]: [
        'Use delay between 0-2000ms',
        'Avoid long delays that frustrate users',
        'Consider staggered animations instead of long delays',
      ],
      [ErrorCodes.UNSUPPORTED_ANIMATION]: [
        'Use supported animation types: fade, slide, zoom, flip',
        'Check for typos in animation type names',
        'Consider using a similar supported animation',
      ],
      [ErrorCodes.OBSERVER_NOT_SUPPORTED]: [
        "The browser doesn't support Intersection Observer",
        'Consider using a polyfill for older browsers',
        'Animations will fall back to immediate visibility',
      ],
      [ErrorCodes.INVALID_ELEMENT]: [
        'Ensure the target element exists in the DOM',
        'Check that refs are properly attached',
        "Verify the element hasn't been unmounted",
      ],
    };

    return suggestions[errorCode] || [];
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback - render children without animation
      if (process.env.NODE_ENV === 'development') {
        return (
          <div
            style={{
              padding: '16px',
              border: '2px dashed #ff6b6b',
              borderRadius: '4px',
              backgroundColor: '#fff5f5',
              color: '#c92a2a',
            }}
          >
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
              ⚠️ Animation Error
            </h4>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px' }}>
              {this.state.error?.message || 'An animation error occurred'}
            </p>
            <details style={{ fontSize: '11px', opacity: 0.8 }}>
              <summary style={{ cursor: 'pointer' }}>Error Details</summary>
              <pre style={{ margin: '8px 0 0 0', whiteSpace: 'pre-wrap' }}>
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
            <div style={{ marginTop: '12px' }}>{this.props.children}</div>
          </div>
        );
      }

      // Production fallback - just render children
      return this.props.children;
    }

    return this.props.children;
  }
}

/**
 * Higher-order component that wraps components with error boundary
 */
export const withAnimationErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<AnimationErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <AnimationErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </AnimationErrorBoundary>
  );

  WrappedComponent.displayName = `withAnimationErrorBoundary(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WrappedComponent;
};
