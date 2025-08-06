# Animate On View

A high-performance, zero-dependency animation library for React/Next.js and Svelte with TypeScript support. Create smooth scroll-triggered animations with minimal setup.

[![npm version](https://badge.fury.io/js/animate-on-view.svg)](https://badge.fury.io/js/animate-on-view)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/animate-on-view)](https://bundlephobia.com/package/animate-on-view)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)


🌐 **[Click Here to see Demo](https://animate-on-view.vercel.app/)**  

## Features

- 🚀 **Zero Dependencies** - No external libraries required
- ⚡ **High Performance** - Uses Intersection Observer API for optimal performance
- 🎨 **40+ Built-in Animations** - Comprehensive collection of animation presets
- 🔧 **Fully Customizable** - Create your own animation variants
- 📱 **Responsive** - Works seamlessly across all devices
- 🎯 **TypeScript Support** - Full type safety and IntelliSense
- 🔄 **Framework Agnostic** - Supports both React and Svelte
- 📦 **Tree Shakeable** - Import only what you need
- 🎭 **SSR Compatible** - Works with Next.js and SvelteKit

## Installation

```bash
npm install animate-on-view
# or
yarn add animate-on-view
# or
pnpm add animate-on-view
```

## Quick Start

### React/Next.js

```tsx
import { AnimateOnView } from 'animate-on-view/react';

function App() {
  return (
    <div>
      <AnimateOnView type="fadeIn">
        <h1>Hello World!</h1>
      </AnimateOnView>
      
      <AnimateOnView type="slideUp" duration={800} delay={200}>
        <p>This text slides up with custom timing</p>
      </AnimateOnView>
    </div>
  );
}
```

### Svelte/SvelteKit

```svelte
<script>
  import { AnimateOnView } from 'animate-on-view/svelte';
</script>

<AnimateOnView type="fadeIn">
  <h1>Hello World!</h1>
</AnimateOnView>

<AnimateOnView type="slideUp" duration={800} delay={200}>
  <p>This text slides up with custom timing</p>
</AnimateOnView>
```

## Animation Types

### Basic Fade Animations
- `fadeIn` - Simple fade in
- `fadeInUp` - Fade in from bottom
- `fadeInDown` - Fade in from top
- `fadeInLeft` - Fade in from left
- `fadeInRight` - Fade in from right

### Slide Animations
- `slideUp` - Slide up from bottom
- `slideDown` - Slide down from top
- `slideLeft` - Slide from right to left
- `slideRight` - Slide from left to right

### Scale Animations
- `scaleIn` - Scale from small to normal
- `scaleOut` - Scale from large to normal
- `scaleX` - Scale horizontally
- `scaleY` - Scale vertically

### Rotation Animations
- `rotateIn` - Rotate and scale in
- `rotateInLeft` - Rotate from left
- `rotateInRight` - Rotate from right

### Flip Animations
- `flipX` - Flip horizontally
- `flipY` - Flip vertically

### Zoom Animations
- `zoomIn` - Zoom in effect
- `zoomInUp` - Zoom in from bottom
- `zoomInDown` - Zoom in from top
- `zoomInLeft` - Zoom in from left
- `zoomInRight` - Zoom in from right

### Bounce Animations
- `bounceIn` - Bounce scale effect
- `bounceInUp` - Bounce from bottom
- `bounceInDown` - Bounce from top
- `bounceInLeft` - Bounce from left
- `bounceInRight` - Bounce from right

### Elastic Animations
- `elasticIn` - Elastic scale effect
- `elasticInUp` - Elastic from bottom
- `elasticInDown` - Elastic from top

### Special Effects
- `blurIn` - Blur to clear
- `blurInUp` - Blur and slide up
- `skewIn` - Skew effect
- `skewInUp` - Skew and slide up
- `rollIn` - Roll in effect
- `lightSpeedIn` - Light speed effect
- `jackInTheBox` - Jack in the box effect

### Subtle Animations
- `gentle` - Gentle fade and move
- `soft` - Soft scale effect
- `smooth` - Smooth slide effect

### Dramatic Animations
- `dramatic` - Dramatic rotate and scale
- `explosive` - Explosive scale and rotate

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `AnimationType` | `'fadeIn'` | Animation type to use |
| `variant` | `AnimationVariant` | - | Custom animation variant |
| `threshold` | `number` | `0.1` | Intersection threshold (0-1) |
| `rootMargin` | `string` | `'0px'` | Root margin for intersection |
| `triggerOnce` | `boolean` | `true` | Trigger animation only once |
| `duration` | `number` | `600` | Animation duration in ms |
| `delay` | `number` | `0` | Animation delay in ms |
| `easing` | `string` | `'ease-out'` | CSS easing function |
| `className` | `string` | - | CSS class name |
| `style` | `object/string` | - | Inline styles |
| `onInView` | `function` | - | Callback when element enters view |
| `onOutView` | `function` | - | Callback when element exits view |

### Custom Animation Variants

Create your own animation variants:

```tsx
// React
const customVariant = {
  initial: { 
    opacity: 0, 
    transform: 'translateY(100px) rotate(45deg)' 
  },
  animate: { 
    opacity: 1, 
    transform: 'translateY(0px) rotate(0deg)' 
  },
  transition: { 
    duration: 1000, 
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' 
  }
};

<AnimateOnView variant={customVariant}>
  <div>Custom animation!</div>
</AnimateOnView>
```

```svelte
<!-- Svelte -->
<script>
  const customVariant = {
    initial: { 
      opacity: 0, 
      transform: 'translateY(100px) rotate(45deg)' 
    },
    animate: { 
      opacity: 1, 
      transform: 'translateY(0px) rotate(0deg)' 
    },
    transition: { 
      duration: 1000, 
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' 
    }
  };
</script>

<AnimateOnView variant={customVariant}>
  <div>Custom animation!</div>
</AnimateOnView>
```

## Advanced Usage

### React Element Variants

Use pre-built animated elements with the `animate` object:

```tsx
import { animate } from 'animate-on-view/react';

function App() {
  return (
    <div>
      {/* Basic usage */}
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
      
      {/* Self-closing elements work perfectly */}
      <animate.input 
        type="fadeIn" 
        placeholder="Animated input"
        className="form-control"
      />
      
      {/* Advanced usage with all props */}
      <animate.h1 
        type="fadeInUp" 
        duration={800}
        delay={100}
        threshold={0.3}
      >
        Animated Heading
      </animate.h1>
      
      <animate.section 
        type="slideLeft" 
        className="my-section"
        style={{ padding: '20px' }}
      >
        <p>Animated Section Content</p>
      </animate.section>
      
      {/* Custom styling */}
      <animate.button
        type="bounceIn"
        delay={500}
        onClick={() => alert('Clicked!')}
        className="btn btn-primary"
      >
        Animated Button
      </animate.button>
    </div>
  );
}
```

**Available animated elements:**
- **Text Elements**: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `span`
- **Layout Elements**: `div`, `section`, `article`, `aside`, `header`, `footer`, `main`, `nav`
- **List Elements**: `ul`, `ol`, `li`
- **Media Elements**: `img`
- **Interactive Elements**: All elements support standard HTML attributes and event handlers

**Key Benefits:**
- All standard HTML attributes are supported
- Event handlers work normally (`onClick`, `onMouseOver`, etc.)
- CSS classes and inline styles can be applied
- TypeScript support with proper element-specific props
- Maintains semantic HTML structure

### Svelte Component Variants

Use pre-built animated components with all the same animation types as React:

```svelte
<script>
  import { AnimateH1, AnimateP, AnimateDiv } from 'animate-on-view/svelte';
</script>

{/* All 40+ animation types are available */}
<AnimateH1 type="fadeInUp">Animated Heading</AnimateH1>
<AnimateP type="slideLeft" delay={200}>Animated Paragraph</AnimateP>
<AnimateDiv type="scaleIn" duration={1000}>Animated Div</AnimateDiv>

{/* Advanced animations */}
<AnimateH1 type="bounceInDown" duration={800}>Bouncy Title</AnimateH1>
<AnimateP type="blurInUp" delay={300}>Blur Effect Text</AnimateP>
<AnimateDiv type="jackInTheBox" delay={500}>Surprise Box</AnimateDiv>

{/* Dramatic effects */}
<AnimateH1 type="dramatic">Dramatic Entrance</AnimateH1>
<AnimateP type="lightSpeedIn">Lightning Fast</AnimateP>
```

**Available Components:**
- `AnimateH1`, `AnimateH2` - Animated headings
- `AnimateP` - Animated paragraphs  
- `AnimateDiv` - Animated containers
- `AnimateOnView` - Base component for custom elements

**All Animation Types Supported:**
Svelte now supports all 40+ animation types available in React, including fadeIn, slideUp, bounceIn, dramatic, explosive, and many more!

### Intersection Observer Options

Fine-tune when animations trigger:

```tsx
<AnimateOnView
  type="fadeIn"
  threshold={0.5}        // Trigger when 50% visible
  rootMargin="100px"     // Trigger 100px before entering viewport
  triggerOnce={false}    // Re-trigger when scrolling back
>
  <div>Content</div>
</AnimateOnView>
```

### Callbacks

Handle animation events:

```tsx
<AnimateOnView
  type="slideUp"
  onInView={() => console.log('Element entered view!')}
  onOutView={() => console.log('Element left view!')}
>
  <div>Content with callbacks</div>
</AnimateOnView>
```

## Performance Tips

1. **Use `triggerOnce={true}`** (default) for better performance
2. **Adjust `threshold`** based on your needs (lower values trigger earlier)
3. **Use `rootMargin`** to pre-load animations before they're visible
4. **Prefer CSS transforms** over changing layout properties in custom variants
5. **Import only what you need** to keep bundle size small

## Browser Support

- Chrome 58+
- Firefox 55+
- Safari 12.1+
- Edge 16+

Uses Intersection Observer API with automatic fallback for older browsers.

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import type { AnimateProps, AnimationVariant } from 'animate-on-view/react';

const MyComponent: React.FC<AnimateProps> = (props) => {
  // Your component logic
};
```

## Examples

### Staggered Animations

```tsx
const items = ['Item 1', 'Item 2', 'Item 3'];

return (
  <div>
    {items.map((item, index) => (
      <AnimateOnView
        key={item}
        type="slideUp"
        delay={index * 100}
      >
        <div>{item}</div>
      </AnimateOnView>
    ))}
  </div>
);
```

### Complex Animation Sequence

```tsx
<div>
  <AnimateOnView type="fadeInDown" duration={600}>
    <h1>Welcome</h1>
  </AnimateOnView>
  
  <AnimateOnView type="slideUp" delay={300} duration={800}>
    <p>This is a subtitle that appears after the title</p>
  </AnimateOnView>
  
  <AnimateOnView type="scaleIn" delay={600} duration={1000}>
    <button>Get Started</button>
  </AnimateOnView>
</div>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © 2025 denisetiya

## Changelog

### v1.0.0
- Initial release
- Support for React and Svelte
- 40+ built-in animation types
- TypeScript support
- Zero dependencies