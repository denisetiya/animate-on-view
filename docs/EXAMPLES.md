# Advanced Usage Examples

## Table of Contents

- [Custom Animation Sequences](#custom-animation-sequences)
- [Staggered Animations](#staggered-animations)
- [Scroll-Triggered Counters](#scroll-triggered-counters)
- [Image Galleries](#image-galleries)
- [Navigation Animations](#navigation-animations)
- [Form Animations](#form-animations)
- [Loading States](#loading-states)
- [Complex Layouts](#complex-layouts)

## Custom Animation Sequences

### Sequential Card Animations

```tsx
import { AnimateOnView } from 'animate-on-view';

const cards = [
  { id: 1, title: 'Card 1', content: 'First card content' },
  { id: 2, title: 'Card 2', content: 'Second card content' },
  { id: 3, title: 'Card 3', content: 'Third card content' },
];

function CardSequence() {
  return (
    <div className="card-container">
      {cards.map((card, index) => (
        <AnimateOnView
          key={card.id}
          type="slide"
          direction="up"
          duration={600}
          delay={index * 200} // Stagger by 200ms
          once={true}
        >
          <div className="card">
            <h3>{card.title}</h3>
            <p>{card.content}</p>
          </div>
        </AnimateOnView>
      ))}
    </div>
  );
}
```

### Multi-Stage Animation

```tsx
import { useScrollAnimation } from 'animate-on-view';
import { useState, useEffect } from 'react';

function MultiStageAnimation() {
  const [stage, setStage] = useState(0);
  
  const { ref, isVisible } = useScrollAnimation({
    type: 'fade',
    duration: 400,
    once: true
  });

  useEffect(() => {
    if (isVisible) {
      const timers = [
        setTimeout(() => setStage(1), 200),
        setTimeout(() => setStage(2), 600),
        setTimeout(() => setStage(3), 1000),
      ];
      
      return () => timers.forEach(clearTimeout);
    }
  }, [isVisible]);

  return (
    <div ref={ref} className="multi-stage">
      <AnimateOnView type="fade" disabled={stage < 1}>
        <h2>Title appears first</h2>
      </AnimateOnView>
      
      <AnimateOnView type="slide" direction="left" disabled={stage < 2}>
        <p>Content slides in second</p>
      </AnimateOnView>
      
      <AnimateOnView type="zoom" direction="in" disabled={stage < 3}>
        <button>Button zooms in last</button>
      </AnimateOnView>
    </div>
  );
}
```

## Staggered Animations

### Grid Layout with Staggered Entrance

```tsx
function StaggeredGrid({ items }) {
  return (
    <div className="grid">
      {items.map((item, index) => {
        // Calculate stagger delay based on position
        const row = Math.floor(index / 3);
        const col = index % 3;
        const delay = (row * 100) + (col * 50);
        
        return (
          <AnimateOnView
            key={item.id}
            type="slide"
            direction="up"
            duration={500}
            delay={delay}
            easing="ease-out"
          >
            <div className="grid-item">
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>
            </div>
          </AnimateOnView>
        );
      })}
    </div>
  );
}
```

### Text Animation with Letter Staggering

```tsx
function StaggeredText({ text }) {
  const letters = text.split('');
  
  return (
    <div className="staggered-text">
      {letters.map((letter, index) => (
        <AnimateOnView
          key={index}
          type="slide"
          direction="down"
          duration={300}
          delay={index * 50}
          style={{ display: 'inline-block' }}
        >
          <span>{letter === ' ' ? '\u00A0' : letter}</span>
        </AnimateOnView>
      ))}
    </div>
  );
}
```

## Scroll-Triggered Counters

### Animated Number Counter

```tsx
import { useScrollAnimation } from 'animate-on-view';
import { useState, useEffect } from 'react';

function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollAnimation({
    type: 'fade',
    once: true
  });

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * target));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);

  return (
    <div ref={ref} className="counter">
      <span className="count">{count.toLocaleString()}</span>
    </div>
  );
}

// Usage
function StatsSection() {
  return (
    <div className="stats">
      <div className="stat">
        <AnimatedCounter target={1000} />
        <p>Happy Customers</p>
      </div>
      <div className="stat">
        <AnimatedCounter target={50} />
        <p>Projects Completed</p>
      </div>
      <div className="stat">
        <AnimatedCounter target={5} />
        <p>Years Experience</p>
      </div>
    </div>
  );
}
```

## Image Galleries

### Masonry Layout with Animations

```tsx
function AnimatedMasonry({ images }) {
  return (
    <div className="masonry">
      {images.map((image, index) => (
        <AnimateOnView
          key={image.id}
          type="zoom"
          direction="in"
          duration={600}
          delay={index * 100}
          easing="ease-out"
        >
          <div className="masonry-item">
            <img 
              src={image.src} 
              alt={image.alt}
              loading="lazy"
            />
            <div className="overlay">
              <h3>{image.title}</h3>
              <p>{image.description}</p>
            </div>
          </div>
        </AnimateOnView>
      ))}
    </div>
  );
}
```

### Progressive Image Loading

```tsx
function ProgressiveImage({ src, alt, placeholder }) {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <AnimateOnView type="fade" duration={800}>
      <div className="progressive-image">
        <img
          src={placeholder}
          alt={alt}
          className="placeholder"
          style={{ opacity: loaded ? 0 : 1 }}
        />
        <img
          src={src}
          alt={alt}
          className="main-image"
          style={{ opacity: loaded ? 1 : 0 }}
          onLoad={() => setLoaded(true)}
        />
      </div>
    </AnimateOnView>
  );
}
```

## Navigation Animations

### Animated Menu Items

```tsx
function AnimatedNavigation({ items, isOpen }) {
  return (
    <nav className={`navigation ${isOpen ? 'open' : ''}`}>
      {items.map((item, index) => (
        <AnimateOnView
          key={item.id}
          type="slide"
          direction="right"
          duration={300}
          delay={index * 100}
          disabled={!isOpen}
        >
          <a href={item.href} className="nav-item">
            {item.label}
          </a>
        </AnimateOnView>
      ))}
    </nav>
  );
}
```

### Breadcrumb Animation

```tsx
function AnimatedBreadcrumb({ path }) {
  return (
    <nav className="breadcrumb">
      {path.map((crumb, index) => (
        <div key={crumb.id} className="breadcrumb-item">
          <AnimateOnView
            type="slide"
            direction="left"
            duration={400}
            delay={index * 150}
          >
            <a href={crumb.href}>{crumb.label}</a>
          </AnimateOnView>
          {index < path.length - 1 && (
            <AnimateOnView
              type="fade"
              delay={(index * 150) + 200}
            >
              <span className="separator">/</span>
            </AnimateOnView>
          )}
        </div>
      ))}
    </nav>
  );
}
```

## Form Animations

### Progressive Form Reveal

```tsx
function AnimatedForm() {
  const [step, setStep] = useState(0);
  
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <form className="animated-form">
      <AnimateOnView type="slide" direction="down" disabled={step !== 0}>
        <div className="form-step">
          <h2>Personal Information</h2>
          <input type="text" placeholder="First Name" />
          <input type="text" placeholder="Last Name" />
          <button type="button" onClick={nextStep}>Next</button>
        </div>
      </AnimateOnView>

      <AnimateOnView type="slide" direction="left" disabled={step !== 1}>
        <div className="form-step">
          <h2>Contact Details</h2>
          <input type="email" placeholder="Email" />
          <input type="tel" placeholder="Phone" />
          <div className="buttons">
            <button type="button" onClick={prevStep}>Back</button>
            <button type="button" onClick={nextStep}>Next</button>
          </div>
        </div>
      </AnimateOnView>

      <AnimateOnView type="zoom" direction="in" disabled={step !== 2}>
        <div className="form-step">
          <h2>Confirmation</h2>
          <p>Please review your information</p>
          <div className="buttons">
            <button type="button" onClick={prevStep}>Back</button>
            <button type="submit">Submit</button>
          </div>
        </div>
      </AnimateOnView>
    </form>
  );
}
```

### Input Field Animations

```tsx
function AnimatedInput({ label, type = 'text', ...props }) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <AnimateOnView type="slide" direction="up" duration={400}>
      <div className={`animated-input ${focused || hasValue ? 'active' : ''}`}>
        <input
          type={type}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            setHasValue(e.target.value.length > 0);
          }}
          {...props}
        />
        <label>{label}</label>
        <div className="underline"></div>
      </div>
    </AnimateOnView>
  );
}
```

## Loading States

### Skeleton Loading Animation

```tsx
function SkeletonLoader({ lines = 3 }) {
  return (
    <div className="skeleton-loader">
      {Array.from({ length: lines }, (_, index) => (
        <AnimateOnView
          key={index}
          type="slide"
          direction="right"
          duration={800}
          delay={index * 200}
        >
          <div className="skeleton-line"></div>
        </AnimateOnView>
      ))}
    </div>
  );
}
```

### Progressive Content Loading

```tsx
function ProgressiveContent({ isLoading, children }) {
  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <AnimateOnView type="fade" duration={600}>
      {children}
    </AnimateOnView>
  );
}
```

## Complex Layouts

### Dashboard Widget Animation

```tsx
function AnimatedDashboard({ widgets }) {
  return (
    <div className="dashboard">
      {widgets.map((widget, index) => {
        const delay = Math.floor(index / 2) * 200 + (index % 2) * 100;
        
        return (
          <AnimateOnView
            key={widget.id}
            type="slide"
            direction="up"
            duration={500}
            delay={delay}
            easing="ease-out"
          >
            <div className="widget">
              <h3>{widget.title}</h3>
              <div className="widget-content">
                {widget.content}
              </div>
            </div>
          </AnimateOnView>
        );
      })}
    </div>
  );
}
```

### Timeline Animation

```tsx
function AnimatedTimeline({ events }) {
  return (
    <div className="timeline">
      {events.map((event, index) => (
        <div key={event.id} className="timeline-item">
          <AnimateOnView
            type="slide"
            direction={index % 2 === 0 ? 'left' : 'right'}
            duration={600}
            delay={index * 300}
          >
            <div className="timeline-content">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <time>{event.date}</time>
            </div>
          </AnimateOnView>
          
          <AnimateOnView
            type="zoom"
            direction="in"
            duration={400}
            delay={(index * 300) + 200}
          >
            <div className="timeline-marker"></div>
          </AnimateOnView>
        </div>
      ))}
    </div>
  );
}
```

## Performance Optimization Examples

### Conditional Animation Loading

```tsx
function ConditionalAnimations({ enableAnimations = true }) {
  const AnimationWrapper = enableAnimations ? AnimateOnView : React.Fragment;
  
  const animationProps = enableAnimations ? {
    type: 'fade',
    duration: 600
  } : {};

  return (
    <AnimationWrapper {...animationProps}>
      <div>Content that may or may not animate</div>
    </AnimationWrapper>
  );
}
```

### Viewport-Based Animation Control

```tsx
function ViewportAwareAnimations() {
  const [isLargeViewport, setIsLargeViewport] = useState(false);
  
  useEffect(() => {
    const checkViewport = () => {
      setIsLargeViewport(window.innerWidth > 768);
    };
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  return (
    <AnimateOnView
      type="slide"
      direction={isLargeViewport ? 'left' : 'up'}
      duration={isLargeViewport ? 800 : 400}
    >
      <div>Responsive animation behavior</div>
    </AnimateOnView>
  );
}
```

These examples demonstrate the flexibility and power of the React Scroll Animation Library for creating engaging, performant user interfaces.