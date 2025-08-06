<!--
  @copyright 2025 denisetiya
  @license MIT
-->

<script lang="ts">
    import { intersectionObserver } from '../actions/intersectionObserver';
    import { defaultVariants } from '../variants';
    import { createTransitionString, createStyleString } from '../utils';
    import type { AnimateOnViewProps } from '../types';
  
    // Props
    let {
      type = 'fadeIn',
      variant,
      threshold = 0.1,
      rootMargin = '0px',
      triggerOnce = true,
      duration,
      delay = 0,
      easing,
      class: className = '',
      style = '',
      onInView,
      onOutView,
      children,
      ...restProps
    }: AnimateOnViewProps = $props();
  
    // State
    let isInView = $state(false);
  
    // Computed values
    const activeVariant = $derived(variant || defaultVariants[type]);
    
    const transition = $derived({
      duration: duration || activeVariant.transition?.duration || 600,
      delay,
      easing: easing || activeVariant.transition?.easing || 'ease-out',
    });
  
    const transitionString = $derived(
      createTransitionString(
        transition.duration,
        transition.delay,
        transition.easing
      )
    );
  
    const currentStyles = $derived(
      isInView ? activeVariant.animate : activeVariant.initial
    );
  
    const finalStyles = $derived(
      createStyleString({
        transition: transitionString,
        willChange: 'opacity, transform',
        ...currentStyles,
      }) + (style ? `; ${style}` : '')
    );
  
    // Handle intersection
    function handleIntersection(intersecting: boolean) {
      isInView = intersecting;
      
      if (intersecting && onInView) {
        onInView();
      } else if (!intersecting && onOutView) {
        onOutView();
      }
    }
  </script>
  
  <div
    use:intersectionObserver={{
      threshold,
      rootMargin,
      triggerOnce,
      onIntersect: handleIntersection,
    }}
    class={className}
    style={finalStyles}
    {...restProps}
  >
    {@render children?.()}
  </div>
  