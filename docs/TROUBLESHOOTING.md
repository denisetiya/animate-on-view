# Troubleshooting Guide

## Common Issues and Solutions

### Table of Contents

- [Animations Not Triggering](#animations-not-triggering)
- [Performance Issues](#performance-issues)
- [SSR and Hydration Problems](#ssr-and-hydration-problems)
- [TypeScript Errors](#typescript-errors)
- [Styling Conflicts](#styling-conflicts)
- [Browser Compatibility](#browser-compatibility)
- [Common Patterns](#common-patterns)

## Animations Not Triggering

### Issue: Animation doesn't start when element comes into view

**Possible Causes:**
1. Element is already in viewport on page load
2. Intersection Observer not supported
3. Element has no height/width
4. CSS conflicts preventing animation

**Solutions:**

```tsx
// 1. Check if element is initially visible
<AnimateOnView 
  type="fade" 
  offset={100} // Trigger before element is fully visible
  once={false} // Allow re-triggering
>
  <div>Content</div>
</AnimateOnView>

// 2. Add fallback for unsupported browsers
import { useScrollAnimation } from 'animate-on-view';

function MyComponent() {
  const { ref, isVisible } = useScrollAnimation({
    type: 'fade',
    duration: 600
  });

  // Fallback: show content immediately if no Intersection Observer
  const shouldShow = isVisible || !('IntersectionObserver' in window);

  return (
    <div ref={ref} className={shouldShow ? 'visible' : 'hidden'}>
      Content
    </div>
  );
}

// 3. Ensure element has dimensions
.animated-element {
  min-height: 1px;
  min-width: 1px;
}
```

### Issue: Animation triggers too early or too late

**Solution:**

```tsx
// Adjust offset to control trigger point
<AnimateOnView 
  type="slide" 
  direction="up"
  offset={200} // Trigger 200px before element enters viewport
>
  <div>Content</div>
</AnimateOnView>

// Or use custom intersection observer options
const { ref, isVisible } = useIntersectionObserver(
  {
    rootMargin: '100px 0px', // Trigger 100px before/after
    threshold: 0.3 // Trigger when 30% visible
  },
  (entries) => {
    // Custom logic
  }
);
```

### Issue: Animation only works once

**Solution:**

```tsx
// Enable repeated animations
<AnimateOnView 
  type="fade"
  once={false} // Allow multiple triggers
  mirror={true} // Animate out when scrolling past
>
  <div>Content</div>
</AnimateOnView>
```

## Performance Issues

### Issue: Animations are janky or slow

**Causes and Solutions:**

```tsx
// 1. Too many simultaneous animations
// Solution: Stagger animations
const items = data.map((item, index) => (
  <AnimateOnView
    key={item.id}
    type="slide"
    direction="up"
    delay={index * 100} // Stagger by 100ms
  >
    <div>{item.content}</div>
  </AnimateOnView>
));

// 2. Heavy DOM operations during animation
// Solution: Use transform and opacity only
.my-animation {
  /* Good - uses GPU acceleration */
  transform: translateY(20px);
  opacity: 0;
  
  /* Avoid - causes layout recalculation */
  /* margin-top: 20px; */
  /* height: 0; */
}

// 3. Too many observers
// Solution: Use shared observer (library handles this automatically)
// But you can optimize further:
<AnimationProvider config={{ duration: 400 }}>
  {/* All children share global config */}
  <AnimateOnView type="fade">
    <div>Item 1</div>
  </AnimateOnView>
  <AnimateOnView type="fade">
    <div>Item 2</div>
  </AnimateOnView>
</AnimationProvider>
```

### Issue: Memory leaks

**Solution:**

```tsx
// Ensure proper cleanup in custom hooks
import { useEffect, useRef } from 'react';

function useCustomAnimation() {
  const observerRef = useRef(null);
  
  useEffect(() => {
    // Setup observer
    observerRef.current = new IntersectionObserver(/* ... */);
    
    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
}
```

## SSR and Hydration Problems

### Issue: Hydration mismatch errors

**Cause:** Server and client render different content

**Solution:**

```tsx
import { useState, useEffect } from 'react';

function SSRSafeAnimation({ children, ...props }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Render without animation on server
  if (!isClient) {
    return <div>{children}</div>;
  }
  
  // Render with animation on client
  return (
    <AnimateOnView {...props}>
      {children}
    </AnimateOnView>
  );
}
```

### Issue: Next.js compatibility problems

**Solution:**

```tsx
// pages/_app.tsx
import { AnimationProvider } from 'animate-on-view';

function MyApp({ Component, pageProps }) {
  return (
    <AnimationProvider>
      <Component {...pageProps} />
    </AnimationProvider>
  );
}

// Use dynamic imports for client-only components
import dynamic from 'next/dynamic';

const AnimatedComponent = dynamic(
  () => import('../components/AnimatedComponent'),
  { ssr: false }
);
```

## TypeScript Errors

### Issue: Type errors with animation props

**Solution:**

```tsx
// Define proper types for your components
import { AnimateOnViewProps } from 'animate-on-view';

interface MyComponentProps extends Partial<AnimateOnViewProps> {
  title: string;
  content: string;
}

function MyComponent({ title, content, ...animationProps }: MyComponentProps) {
  return (
    <AnimateOnView {...animationProps}>
      <div>
        <h2>{title}</h2>
        <p>{content}</p>
      </div>
    </AnimateOnView>
  );
}
```

### Issue: Ref type conflicts

**Solution:**

```tsx
import { useRef } from 'react';
import { useScrollAnimation } from 'animate-on-view';

function MyComponent() {
  // Explicitly type the ref
  const { ref } = useScrollAnimation<HTMLDivElement>({
    type: 'fade'
  });
  
  return <div ref={ref}>Content</div>;
}
```

## Styling Conflicts

### Issue: CSS conflicts with animation styles

**Solution:**

```tsx
// Use CSS specificity or CSS-in-JS
const animatedStyles = {
  // Ensure animation styles take precedence
  '&.animate-fade-in': {
    opacity: 1,
    transform: 'translateY(0)',
    transition: 'all 0.6s ease'
  }
};

// Or use !important sparingly
.my-animation {
  opacity: 0 !important;
  transform: translateY(20px) !important;
}
```

### Issue: Animation classes not applying

**Solution:**

```tsx
// Check class name conflicts
<AnimateOnView 
  type="fade"
  className="my-custom-class" // Make sure this doesn't override animation classes
>
  <div>Content</div>
</AnimateOnView>

// Use CSS modules or styled-components for isolation
import styles from './MyComponent.module.css';

<AnimateOnView className={styles.container}>
  <div>Content</div>
</AnimateOnView>
```

## Browser Compatibility

### Issue: Animations don't work in older browsers

**Solution:**

```tsx
// Feature detection and fallbacks
function BrowserCompatibleAnimation({ children, ...props }) {
  const supportsIntersectionObserver = 'IntersectionObserver' in window;
  const supportsTransform = CSS.supports('transform', 'translateX(0)');
  
  if (!supportsIntersectionObserver || !supportsTransform) {
    // Fallback: show content immediately
    return <div className="no-animation">{children}</div>;
  }
  
  return (
    <AnimateOnView {...props}>
      {children}
    </AnimateOnView>
  );
}
```

### Issue: Reduced motion preferences not respected

**Solution:**

```tsx
// The library automatically handles this, but you can add extra checks
import { useEffect, useState } from 'react';

function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersReducedMotion;
}

function AccessibleAnimation(props) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <AnimateOnView 
      {...props}
      disabled={prefersReducedMotion}
      duration={prefersReducedMotion ? 0 : props.duration}
    >
      {props.children}
    </AnimateOnView>
  );
}
```

## Common Patterns

### Pattern: Conditional Animation Based on Screen Size

```tsx
import { useState, useEffect } from 'react';

function useScreenSize() {
  const [screenSize, setScreenSize] = useState('desktop');
  
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setScreenSize('mobile');
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  return screenSize;
}

function ResponsiveAnimation({ children }) {
  const screenSize = useScreenSize();
  
  const animationProps = {
    mobile: { type: 'fade', duration: 300 },
    tablet: { type: 'slide', direction: 'up', duration: 500 },
    desktop: { type: 'slide', direction: 'left', duration: 700 }
  };
  
  return (
    <AnimateOnView {...animationProps[screenSize]}>
      {children}
    </AnimateOnView>
  );
}
```

### Pattern: Animation State Management

```tsx
import { createContext, useContext, useState } from 'react';

const AnimationStateContext = createContext();

export function AnimationStateProvider({ children }) {
  const [animationStates, setAnimationStates] = useState({});
  
  const setAnimationState = (id, state) => {
    setAnimationStates(prev => ({ ...prev, [id]: state }));
  };
  
  return (
    <AnimationStateContext.Provider value={{ animationStates, setAnimationState }}>
      {children}
    </AnimationStateContext.Provider>
  );
}

export function useAnimationState(id) {
  const { animationStates, setAnimationState } = useContext(AnimationStateContext);
  
  return {
    state: animationStates[id] || 'idle',
    setState: (state) => setAnimationState(id, state)
  };
}
```

### Pattern: Sequential Animation Chain

```tsx
function SequentialAnimations({ items }) {
  const [visibleItems, setVisibleItems] = useState(new Set());
  
  const handleAnimationStart = (index) => {
    setVisibleItems(prev => new Set([...prev, index]));
    
    // Trigger next animation after delay
    if (index < items.length - 1) {
      setTimeout(() => {
        setVisibleItems(prev => new Set([...prev, index + 1]));
      }, 200);
    }
  };
  
  return (
    <div>
      {items.map((item, index) => (
        <AnimateOnView
          key={item.id}
          type="slide"
          direction="up"
          disabled={!visibleItems.has(index)}
          onAnimationStart={() => handleAnimationStart(index)}
        >
          <div>{item.content}</div>
        </AnimateOnView>
      ))}
    </div>
  );
}
```

## Debugging Tips

### Enable Debug Mode

```tsx
// Add debug logging to your animations
<AnimateOnView
  type="fade"
  onAnimationStart={(element) => {
    console.log('Animation started:', element);
  }}
  onAnimationEnd={(element) => {
    console.log('Animation ended:', element);
  }}
>
  <div>Content</div>
</AnimateOnView>
```

### Visualize Intersection Observer

```tsx
// Add visual indicators for debugging
function DebugAnimation({ children, ...props }) {
  const { ref, isVisible } = useScrollAnimation(props);
  
  return (
    <div 
      ref={ref} 
      style={{ 
        border: isVisible ? '2px solid green' : '2px solid red',
        position: 'relative'
      }}
    >
      {children}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        background: isVisible ? 'green' : 'red',
        color: 'white',
        padding: '2px 4px',
        fontSize: '10px'
      }}>
        {isVisible ? 'VISIBLE' : 'HIDDEN'}
      </div>
    </div>
  );
}
```

### Performance Monitoring

```tsx
// Monitor animation performance
function PerformanceMonitor({ children, ...props }) {
  const startTime = useRef();
  
  const handleAnimationStart = (element) => {
    startTime.current = performance.now();
    props.onAnimationStart?.(element);
  };
  
  const handleAnimationEnd = (element) => {
    if (startTime.current) {
      const duration = performance.now() - startTime.current;
      console.log(`Animation took ${duration}ms`);
    }
    props.onAnimationEnd?.(element);
  };
  
  return (
    <AnimateOnView
      {...props}
      onAnimationStart={handleAnimationStart}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </AnimateOnView>
  );
}
```

## Getting Help

If you're still experiencing issues:

1. Check the [GitHub Issues](https://github.com/denisetiya/animate-on-view/issues)
2. Create a minimal reproduction case
3. Include browser version and environment details
4. Check browser console for error messages
5. Verify that Intersection Observer is supported in your target browsers

Remember: Most animation issues are related to CSS conflicts, timing, or browser compatibility. Start with the simplest possible implementation and gradually add complexity.