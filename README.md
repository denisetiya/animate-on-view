# Animate On View

A modern, performant React library for scroll-triggered animations. Built with TypeScript, optimized for performance, and designed to work seamlessly with SSR frameworks like Next.js.

## Features

- 🚀 **Performant**: Uses Intersection Observer API for efficient scroll detection
- 📦 **Lightweight**: Under 15KB gzipped bundle size
- 🎨 **Flexible**: Support for fade, slide, zoom, and flip animations
- ♿ **Accessible**: Respects user motion preferences
- 🔧 **TypeScript**: Full TypeScript support with comprehensive type definitions
- 🌐 **SSR Ready**: Compatible with Next.js and other SSR frameworks
- 🎯 **Modern React**: Built with hooks and functional components

## Installation

### NPM
```bash
npm install animate-on-view
```

### Yarn
```bash
yarn add animate-on-view
```

### PNPM
```bash
pnpm add animate-on-view
```

### CDN (UMD)
```html
<script src="https://unpkg.com/animate-on-view@latest/dist/umd/index.js"></script>
```

## Requirements

- React 16.8+ (hooks support)
- Modern browsers with Intersection Observer support
- TypeScript 4.0+ (optional, for TypeScript projects)

## Quick Start

### Basic Usage

```tsx
import { AnimateOnView } from 'animate-on-view';

function App() {
  return (
    <div>
      <AnimateOnView type="fade">
        <h1>This will fade in when scrolled into view</h1>
      </AnimateOnView>
      
      <AnimateOnView type="slide" direction="up" duration={800}>
        <p>This will slide up with custom duration</p>
      </AnimateOnView>
    </div>
  );
}
```

### Using Hooks

```tsx
import { useScrollAnimation } from 'animate-on-view';

function MyComponent() {
  const { ref, isVisible, trigger, reset } = useScrollAnimation({
    type: 'fade',
    duration: 600
  });

  return (
    <div ref={ref} className={isVisible ? 'animate' : ''}>
      <p>Custom animation control</p>
      <button onClick={trigger}>Trigger Animation</button>
      <button onClick={reset}>Reset Animation</button>
    </div>
  );
}
```

## Animation Types

### Fade
```tsx
<AnimateOnView type="fade">
  <div>Fades in/out</div>
</AnimateOnView>
```

### Slide
```tsx
<AnimateOnView type="slide" direction="up">
  <div>Slides from bottom</div>
</AnimateOnView>

<AnimateOnView type="slide" direction="left">
  <div>Slides from right</div>
</AnimateOnView>
```

### Zoom
```tsx
<AnimateOnView type="zoom" direction="in">
  <div>Zooms in</div>
</AnimateOnView>
```

### Flip
```tsx
<AnimateOnView type="flip" direction="left">
  <div>Flips horizontally</div>
</AnimateOnView>
```

## Configuration Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'fade' \| 'slide' \| 'zoom' \| 'flip'` | `'fade'` | Animation type |
| `direction` | `'up' \| 'down' \| 'left' \| 'right' \| 'in' \| 'out'` | - | Animation direction |
| `duration` | `number` | `600` | Animation duration in ms (100-3000) |
| `delay` | `number` | `0` | Animation delay in ms (0-2000) |
| `easing` | `string` | `'ease'` | CSS easing function |
| `offset` | `number` | `0` | Trigger offset from viewport edge |
| `once` | `boolean` | `true` | Animate only once |
| `mirror` | `boolean` | `false` | Animate out when scrolling past |
| `disabled` | `boolean` | `false` | Disable animations |

## Advanced Usage

### Global Configuration

```tsx
import { AnimationProvider } from 'animate-on-view';

function App() {
  return (
    <AnimationProvider 
      config={{ duration: 800, easing: 'ease-out' }}
      disabled={false}
    >
      <YourApp />
    </AnimationProvider>
  );
}
```

### Custom Animations with Callbacks

```tsx
<AnimateOnView
  type="slide"
  direction="up"
  onAnimationStart={(element) => {
    console.log('Animation started:', element);
  }}
  onAnimationEnd={(element) => {
    console.log('Animation completed:', element);
  }}
>
  <div>Content with callbacks</div>
</AnimateOnView>
```

### Conditional Animations

```tsx
const [shouldAnimate, setShouldAnimate] = useState(true);

<AnimateOnView type="fade" disabled={!shouldAnimate}>
  <div>Conditionally animated content</div>
</AnimateOnView>
```

## SSR Support

The library works out of the box with Next.js and other SSR frameworks:

```tsx
// pages/index.tsx (Next.js)
import { AnimateOnView } from 'animate-on-view';

export default function Home() {
  return (
    <AnimateOnView type="fade">
      <h1>SSR-compatible animation</h1>
    </AnimateOnView>
  );
}
```

## Performance Tips

1. **Use `once={true}`** for animations that should only happen once
2. **Limit simultaneous animations** to maintain 60fps
3. **Use `transform` and `opacity`** based animations for best performance
4. **Respect motion preferences** - the library automatically handles this

## Browser Support

- Chrome 58+
- Firefox 55+
- Safari 12.1+
- Edge 79+

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and contribution guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.