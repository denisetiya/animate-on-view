import React, { forwardRef } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { defaultVariants } from '../../variants';
import { createTransitionString, mergeStyles } from '../../utils';
import type { AnimateProps } from '../../types';

export const AnimateOnView = forwardRef<HTMLDivElement, AnimateProps>(
    (
        {
            children,
            type = 'fadeIn',
            variant,
            threshold = 0.1,
            rootMargin = '0px',
            triggerOnce = true,
            duration,
            delay = 0,
            easing,
            className,
            style,
            onInView,
            onOutView,
            ...props
        },
        forwardedRef
    ) => {
        const { ref, isInView } = useIntersectionObserver({
            threshold,
            rootMargin,
            triggerOnce,
        });

        // Use custom variant or default variant
        const activeVariant = variant || defaultVariants[type];

        // Override transition properties if provided
        const transition = {
            duration: duration || activeVariant.transition?.duration || 600,
            delay,
            easing: easing || activeVariant.transition?.easing || 'ease-out',
        };

        // Create transition CSS
        const transitionString = createTransitionString(
            transition.duration,
            transition.delay,
            transition.easing
        );

        // Determine current styles based on view state
        const currentStyles = isInView
            ? activeVariant.animate
            : activeVariant.initial;

        // Merge all styles
        const finalStyles = mergeStyles(
            {
                transition: transitionString,
                willChange: 'opacity, transform',
                ...currentStyles,
            },
            style
        );

        // Handle callbacks
        React.useEffect(() => {
            if (isInView && onInView) {
                onInView();
            } else if (!isInView && onOutView) {
                onOutView();
            }
        }, [isInView, onInView, onOutView]);

        // Combine refs
        const combinedRef = React.useCallback(
            (node: HTMLDivElement) => {
                // Cast to mutable ref to fix TypeScript issue
                (ref as React.MutableRefObject<HTMLElement | null>).current = node;

                if (forwardedRef) {
                    if (typeof forwardedRef === 'function') {
                        forwardedRef(node);
                    } else {
                        forwardedRef.current = node;
                    }
                }
            },
            [ref, forwardedRef]
        );

        return (
            <div
                ref={combinedRef}
                className={className}
                style={finalStyles}
                {...props}
            >
                {children}
            </div>
        );
    }
);

AnimateOnView.displayName = 'AnimateOnView';

// Create element variants
const createAnimateElement = (tag: keyof JSX.IntrinsicElements) => {
    return forwardRef<any, AnimateProps & JSX.IntrinsicElements[typeof tag]>(
        (props, ref) => {
            const { children, ...animateProps } = props;
            return (
                <AnimateOnView ref={ref} {...animateProps}>
                    {React.createElement(tag, {}, children)}
                </AnimateOnView>
            );
        }
    );
};

// Export animate elements
export const animate = {
    div: createAnimateElement('div'),
    span: createAnimateElement('span'),
    h1: createAnimateElement('h1'),
    h2: createAnimateElement('h2'),
    h3: createAnimateElement('h3'),
    h4: createAnimateElement('h4'),
    h5: createAnimateElement('h5'),
    h6: createAnimateElement('h6'),
    p: createAnimateElement('p'),
    img: createAnimateElement('img'),
    section: createAnimateElement('section'),
    article: createAnimateElement('article'),
    aside: createAnimateElement('aside'),
    header: createAnimateElement('header'),
    footer: createAnimateElement('footer'),
    main: createAnimateElement('main'),
    nav: createAnimateElement('nav'),
    ul: createAnimateElement('ul'),
    ol: createAnimateElement('ol'),
    li: createAnimateElement('li'),
};