# 🎬 Animate On View

High-performance, zero-dependency animation library for React/Next.js and Svelte with TypeScript support. Trigger smooth animations when elements enter the viewport.

[![npm version](https://badge.fury.io/js/animate-on-view.svg)](https://badge.fury.io/js/animate-on-view)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/animate-on-view)](https://bundlephobia.com/package/animate-on-view)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

## ✨ Features

- 🚀 **High Performance**: Uses Intersection Observer API for optimal performance
- 📦 **Zero Dependencies**: No external dependencies, minimal bundle size (~3KB)
- 🎯 **TypeScript Support**: Full TypeScript support with type definitions
- ⚡ **Framework Agnostic**: Works with React, Next.js, and Svelte
- 🎨 **Customizable**: Pre-built animations + custom animation variants
- 🔧 **Flexible**: Configurable thresholds, delays, and easing functions
- 📱 **Responsive**: Works great on all devices and screen sizes

## 📦 Installation

```bash
npm install animate-on-view
# or
yarn add animate-on-view
# or
pnpm add animate-on-view
```

## 🚀 Quick Start

### React/Next.js

```tsx
import { animate } from 'animate-on-view/react';

function App() {
  return (
    <div>
      <animate.div type="fadeIn">
        <h1>Hello World!</h1>
      </animate.div>
      
      <animate.p type="slideUp" delay={200}>
        This slides up with a 200ms delay
      </animate.p>
      
      <animate.img 
        type="scaleIn" 
        src="image.jpg" 
        alt="Animated image"
      />
    </div>
  );
}
```

### Svelte/SvelteKit

```svelte
<script>
  import { AnimateDiv, AnimateP } from 'animate-on-view/svelte';
</script>

<AnimateDiv type="fadeIn">
  <h1>Hello World!</h1>
</AnimateDiv>

<AnimateP type="slideUp" delay={200}>
  This slides up with a 200ms delay
</AnimateP>
```

## 🎨 Available Animations

| Animation | Description |
|-----------|-------------|
| `fadeIn` | Fades in the element |
| `slideUp` | Slides up from bottom |
| `slideDown` | Slides down from top |
| `slideLeft` | Slides in from right |
| `slideRight` | Slides in from left |
| `scaleIn` | Scales up from smaller size |
| `rotateIn` | Rotates and scales into view |

## 📖 API Reference

### Basic Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `AnimationType` | `'fadeIn'` | Pre-built animation type |
| `variant` | `AnimationVariant` | - | Custom animation variant |
| `threshold` | `number` | `0.1` | Intersection threshold (0-1) |
| `rootMargin` | `string` | `'0px'` | Root margin for intersection observer |
| `triggerOnce` | `boolean` | `true` | Whether to trigger animation only once |
| `duration` | `number` | `600` | Animation duration in milliseconds |
| `delay` | `number` | `0` | Animation delay in milliseconds |
| `easing` | `string` | `'ease-out'` | CSS easing function |

### Event Callbacks

| Prop | Type | Description |
|------|------|-------------|
| `onInView` | `() => void` | Called when element enters viewport |
| `onOutView` | `() => void` | Called when element leaves viewport |

## 🎯 Advanced Usage

### Custom Animation Variants

Create your own animation variants for complete control:

```tsx
import { AnimateOnView } from 'animate-on-view/react';

const customVariant = {
  initial: { 
    opacity: 0, 
    transform: 'translateY(100px) rotate(10deg)' 
  },
  animate: { 
    opacity: 1, 
    transform: 'translateY(0px) rotate(0deg)' 
  },
  transition: { 
    duration: 1000, 
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' 
  },
};

<AnimateOnView variant={customVariant}>
  <div>Custom animated content</div>
</AnimateOnView>
```

### Multiple Trigger Animation

Animate elements every time they enter/leave viewport:

```tsx
<animate.div 
  type="fadeIn" 
  triggerOnce={false}
  onInView={() => console.log('In view!')}
  onOutView={() => console.log('Out of view!')}
>
  I animate every time you scroll past me!
</animate.div>
```

### Staggered Animations

Create beautiful staggered animations:

```tsx
{items.map((item, index) => (
  <animate.div
    key={item.id}
    type="slideUp"
    delay={index * 100}
    className="card"
  >
    {item.content}
  </animate.div>
))}
```

### Custom Intersection Settings

Fine-tune when animations trigger:

```tsx
<animate.div 
  type="scaleIn"
  threshold={0.5}        // Trigger when 50% visible
  rootMargin="100px"     // Trigger 100px before entering viewport
  duration={1200}        // Slower animation
>
  Precisely controlled animation
</animate.div>
```

## 🎛️ Configuration Examples

### Bouncy Entrance

```tsx
<animate.div 
  type="scaleIn"
  duration={800}
  easing="cubic-bezier(0.68, -0.55, 0.265, 1.55)"
>
  Bouncy animation!
</animate.div>
```

### Smooth Slide with Long Delay

```tsx
<animate.h2 
  type="slideLeft"
  duration={1000}
  delay={500}
  easing="cubic-bezier(0.25, 0.46, 0.45, 0.94)"
>
  Smooth and delayed
</animate.h2>
```

### Quick Fade

```tsx
<animate.p 
  type="fadeIn"
  duration={300}
  easing="ease-in-out"
>
  Quick fade effect
</animate.p>
```

## 🔧 TypeScript Support

The library is built with TypeScript and provides full type safety:

```tsx
import type { AnimationVariant } from 'animate-on-view/react';

const myVariant: AnimationVariant = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 500 }
};

// TypeScript will ensure type safety
<AnimateOnView variant={myVariant}>
  <div>Type-safe animations</div>
</AnimateOnView>
```

## ⚡ Performance Tips

1. **Use `triggerOnce={true}`** for better performance when you don't need repeated animations
2. **Set appropriate `threshold`** values to avoid unnecessary re-renders
3. **Use `rootMargin`** to preload animations before they're needed
4. **Avoid complex custom variants** with too many CSS properties
5. **Consider using CSS `will-change`** for better performance on complex animations

## 🌐 Browser Support

- Chrome 58+
- Firefox 55+
- Safari 12.1+
- Edge 16+

All browsers that support Intersection Observer API.

## 📱 Framework Examples

### Next.js App Router

```tsx
'use client';
import { animate } from 'animate-on-view/react';

export default function HomePage() {
  return (
    <main>
      <animate.section type="fadeIn">
        <h1>Welcome to my Next.js app</h1>
      </animate.section>
    </main>
  );
}
```

### SvelteKit

```svelte
<script lang="ts">
  import { AnimateDiv } from 'animate-on-view/svelte';
  
  function handleInView() {
    console.log('Element is visible!');
  }
</script>

<AnimateDiv 
  type="slideUp" 
  onInView={handleInView}
  class="my-component"
>
  <h1>SvelteKit Animation</h1>
</AnimateDiv>
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by AOS (Animate On Scroll) library
- Built with modern web standards
- Optimized for performance and developer experience

## 📊 Bundle Size

| Package | Minified | Minified + Gzipped |
|---------|----------|--------------------|
| React | ~4KB | ~2KB |
| Svelte | ~3KB | ~1.5KB |

---

Made with ❤️ for the web development community