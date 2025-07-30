# API Reference

## Components

### AnimateOnView

The main component for adding scroll-triggered animations to your React elements.

```tsx
import { AnimateOnView } from 'animate-on-view';
```

#### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `children` | `React.ReactNode` | - | ✅ | Content to animate |
| `type` | `AnimationType` | `'fade'` | ❌ | Type of animation |
| `direction` | `AnimationDirection` | `undefined` | ❌ | Direction of animation |
| `duration` | `number` | `600` | ❌ | Animation duration in milliseconds (100-3000) |
| `delay` | `number` | `0` | ❌ | Animation delay in milliseconds (0-2000) |
| `easing` | `EasingFunction` | `'ease'` | ❌ | CSS easing function |
| `offset` | `number` | `0` | ❌ | Trigger offset from viewport edge in pixels |
| `once` | `boolean` | `true` | ❌ | Whether to animate only once |
| `mirror` | `boolean` | `false` | ❌ | Whether to animate out when scrolling past |
| `className` | `string` | `undefined` | ❌ | Additional CSS class |
| `style` | `React.CSSProperties` | `undefined` | ❌ | Additional inline styles |
| `onAnimationStart` | `AnimationCallback` | `undefined` | ❌ | Callback when animation starts |
| `onAnimationEnd` | `AnimationCallback` | `undefined` | ❌ | Callback when animation ends |
| `disabled` | `boolean` | `false` | ❌ | Whether to disable animations |

#### Example

```tsx
<AnimateOnView
  type="slide"
  direction="up"
  duration={800}
  delay={200}
  easing="ease-out"
  offset={100}
  once={false}
  mirror={true}
  className="my-animation"
  onAnimationStart={(element) => console.log('Started', element)}
  onAnimationEnd={(element) => console.log('Ended', element)}
>
  <div>Your content here</div>
</AnimateOnView>
```

### AnimationProvider

Context provider for global animation configuration.

```tsx
import { AnimationProvider } from 'animate-on-view';
```

#### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `children` | `React.ReactNode` | - | ✅ | Child components |
| `config` | `Partial<AnimationConfig>` | `{}` | ❌ | Global animation defaults |
| `disabled` | `boolean` | `false` | ❌ | Globally disable all animations |

#### Example

```tsx
<AnimationProvider 
  config={{ 
    duration: 800, 
    easing: 'ease-out',
    once: false 
  }}
  disabled={false}
>
  <App />
</AnimationProvider>
```

## Hooks

### useScrollAnimation

Hook for imperative animation control.

```tsx
import { useScrollAnimation } from 'animate-on-view';
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config` | `AnimationConfig` | ✅ | Animation configuration |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `ref` | `React.RefObject<HTMLElement>` | Ref to attach to the element |
| `isVisible` | `boolean` | Whether element is currently visible |
| `isAnimating` | `boolean` | Whether animation is currently running |
| `trigger` | `() => void` | Manually trigger animation |
| `reset` | `() => void` | Reset animation to initial state |

#### Example

```tsx
function MyComponent() {
  const { ref, isVisible, isAnimating, trigger, reset } = useScrollAnimation({
    type: 'fade',
    duration: 600,
    once: false
  });

  return (
    <div ref={ref}>
      <p>Visible: {isVisible ? 'Yes' : 'No'}</p>
      <p>Animating: {isAnimating ? 'Yes' : 'No'}</p>
      <button onClick={trigger}>Trigger</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### useIntersectionObserver

Low-level hook for intersection observation.

```tsx
import { useIntersectionObserver } from 'animate-on-view';
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | `IntersectionObserverInit` | ❌ | Observer options |
| `callback` | `IntersectionObserverCallback` | ✅ | Callback function |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `ref` | `React.RefObject<HTMLElement>` | Ref to attach to observed element |
| `isIntersecting` | `boolean` | Whether element is intersecting |

#### Example

```tsx
function MyComponent() {
  const { ref, isIntersecting } = useIntersectionObserver(
    { threshold: 0.5 },
    (entries) => {
      console.log('Intersection changed:', entries);
    }
  );

  return (
    <div ref={ref}>
      {isIntersecting ? 'Visible' : 'Hidden'}
    </div>
  );
}
```

## Types

### AnimationType

```tsx
type AnimationType = 'fade' | 'slide' | 'zoom' | 'flip';
```

### AnimationDirection

```tsx
type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'in' | 'out';
```

### EasingFunction

```tsx
type EasingFunction = 
  | 'ease' 
  | 'ease-in' 
  | 'ease-out' 
  | 'ease-in-out' 
  | 'linear'
  | string; // Custom CSS easing function
```

### AnimationConfig

```tsx
interface AnimationConfig {
  type: AnimationType;
  direction?: AnimationDirection;
  duration?: number; // 100-3000ms
  delay?: number; // 0-2000ms
  easing?: EasingFunction;
  offset?: number; // pixels from viewport edge
  once?: boolean; // animate only once
  mirror?: boolean; // animate out when scrolling past
}
```

### AnimationCallback

```tsx
type AnimationCallback = (element: HTMLElement) => void;
```

### UseScrollAnimationReturn

```tsx
interface UseScrollAnimationReturn {
  ref: React.RefObject<HTMLElement>;
  isVisible: boolean;
  isAnimating: boolean;
  trigger: () => void;
  reset: () => void;
}
```

## Animation Details

### Fade Animation

- **Type**: `'fade'`
- **Directions**: Not applicable
- **Effect**: Changes opacity from 0 to 1

### Slide Animation

- **Type**: `'slide'`
- **Directions**: `'up'`, `'down'`, `'left'`, `'right'`
- **Effect**: Translates element from specified direction

### Zoom Animation

- **Type**: `'zoom'`
- **Directions**: `'in'`, `'out'`
- **Effect**: Scales element from/to specified direction

### Flip Animation

- **Type**: `'flip'`
- **Directions**: `'left'`, `'right'`, `'up'`, `'down'`
- **Effect**: Rotates element around specified axis

## Error Handling

The library includes comprehensive error handling:

### AnimationError

```tsx
class AnimationError extends Error {
  constructor(message: string, public code: string);
}
```

### Error Codes

```tsx
const ErrorCodes = {
  INVALID_DURATION: 'INVALID_DURATION',
  INVALID_DELAY: 'INVALID_DELAY', 
  UNSUPPORTED_ANIMATION: 'UNSUPPORTED_ANIMATION',
  OBSERVER_NOT_SUPPORTED: 'OBSERVER_NOT_SUPPORTED'
} as const;
```

## Context API

### AnimationContext

```tsx
interface AnimationContextValue {
  globalConfig: Partial<AnimationConfig>;
  disabled: boolean;
  respectMotionPreferences: boolean;
}
```

Access the context directly:

```tsx
import { useContext } from 'react';
import { AnimationContext } from 'animate-on-view';

function MyComponent() {
  const { globalConfig, disabled } = useContext(AnimationContext);
  // Use context values
}
```