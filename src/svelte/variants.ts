/**
 * @copyright 2025 denisetiya
 * @license MIT
 */

import type { AnimationVariant } from "./types";

export const defaultVariants: Record<string, AnimationVariant> = {
    // Basic Fade Animations
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 600, easing: 'ease-out' },
    },
    fadeInUp: {
      initial: { opacity: 0, transform: 'translateY(30px)' },
      animate: { opacity: 1, transform: 'translateY(0px)' },
      transition: { duration: 600, easing: 'ease-out' },
    },
    fadeInDown: {
      initial: { opacity: 0, transform: 'translateY(-30px)' },
      animate: { opacity: 1, transform: 'translateY(0px)' },
      transition: { duration: 600, easing: 'ease-out' },
    },
    fadeInLeft: {
      initial: { opacity: 0, transform: 'translateX(-30px)' },
      animate: { opacity: 1, transform: 'translateX(0px)' },
      transition: { duration: 600, easing: 'ease-out' },
    },
    fadeInRight: {
      initial: { opacity: 0, transform: 'translateX(30px)' },
      animate: { opacity: 1, transform: 'translateX(0px)' },
      transition: { duration: 600, easing: 'ease-out' },
    },

    // Slide Animations
    slideUp: {
      initial: { opacity: 0, transform: 'translateY(50px)' },
      animate: { opacity: 1, transform: 'translateY(0px)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
    },
    slideDown: {
      initial: { opacity: 0, transform: 'translateY(-50px)' },
      animate: { opacity: 1, transform: 'translateY(0px)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
    },
    slideLeft: {
      initial: { opacity: 0, transform: 'translateX(50px)' },
      animate: { opacity: 1, transform: 'translateX(0px)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
    },
    slideRight: {
      initial: { opacity: 0, transform: 'translateX(-50px)' },
      animate: { opacity: 1, transform: 'translateX(0px)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
    },

    // Scale Animations
    scaleIn: {
      initial: { opacity: 0, transform: 'scale(0.8)' },
      animate: { opacity: 1, transform: 'scale(1)' },
      transition: { duration: 600, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },
    scaleOut: {
      initial: { opacity: 0, transform: 'scale(1.2)' },
      animate: { opacity: 1, transform: 'scale(1)' },
      transition: { duration: 600, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },
    scaleX: {
      initial: { opacity: 0, transform: 'scaleX(0)' },
      animate: { opacity: 1, transform: 'scaleX(1)' },
      transition: { duration: 700, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },
    scaleY: {
      initial: { opacity: 0, transform: 'scaleY(0)' },
      animate: { opacity: 1, transform: 'scaleY(1)' },
      transition: { duration: 700, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },

    // Rotation Animations
    rotateIn: {
      initial: { opacity: 0, transform: 'rotate(-10deg) scale(0.9)' },
      animate: { opacity: 1, transform: 'rotate(0deg) scale(1)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },
    rotateInLeft: {
      initial: { opacity: 0, transform: 'rotate(-45deg)' },
      animate: { opacity: 1, transform: 'rotate(0deg)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },
    rotateInRight: {
      initial: { opacity: 0, transform: 'rotate(45deg)' },
      animate: { opacity: 1, transform: 'rotate(0deg)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },

    // Flip Animations
    flipX: {
      initial: { opacity: 0, transform: 'rotateX(-90deg)' },
      animate: { opacity: 1, transform: 'rotateX(0deg)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },
    flipY: {
      initial: { opacity: 0, transform: 'rotateY(-90deg)' },
      animate: { opacity: 1, transform: 'rotateY(0deg)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },

    // Zoom Animations
    zoomIn: {
      initial: { opacity: 0, transform: 'scale(0.3)' },
      animate: { opacity: 1, transform: 'scale(1)' },
      transition: { duration: 600, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },
    zoomInUp: {
      initial: { opacity: 0, transform: 'scale(0.3) translateY(100px)' },
      animate: { opacity: 1, transform: 'scale(1) translateY(0px)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },
    zoomInDown: {
      initial: { opacity: 0, transform: 'scale(0.3) translateY(-100px)' },
      animate: { opacity: 1, transform: 'scale(1) translateY(0px)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },
    zoomInLeft: {
      initial: { opacity: 0, transform: 'scale(0.3) translateX(-100px)' },
      animate: { opacity: 1, transform: 'scale(1) translateX(0px)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },
    zoomInRight: {
      initial: { opacity: 0, transform: 'scale(0.3) translateX(100px)' },
      animate: { opacity: 1, transform: 'scale(1) translateX(0px)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },

    // Bounce Animations
    bounceIn: {
      initial: { opacity: 0, transform: 'scale(0.3)' },
      animate: { opacity: 1, transform: 'scale(1)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
    },
    bounceInUp: {
      initial: { opacity: 0, transform: 'translateY(100px)' },
      animate: { opacity: 1, transform: 'translateY(0px)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
    },
    bounceInDown: {
      initial: { opacity: 0, transform: 'translateY(-100px)' },
      animate: { opacity: 1, transform: 'translateY(0px)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
    },
    bounceInLeft: {
      initial: { opacity: 0, transform: 'translateX(-100px)' },
      animate: { opacity: 1, transform: 'translateX(0px)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
    },
    bounceInRight: {
      initial: { opacity: 0, transform: 'translateX(100px)' },
      animate: { opacity: 1, transform: 'translateX(0px)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
    },

    // Elastic Animations
    elasticIn: {
      initial: { opacity: 0, transform: 'scale(0)' },
      animate: { opacity: 1, transform: 'scale(1)' },
      transition: { duration: 1000, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
    },
    elasticInUp: {
      initial: { opacity: 0, transform: 'translateY(100px) scale(0.8)' },
      animate: { opacity: 1, transform: 'translateY(0px) scale(1)' },
      transition: { duration: 1000, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
    },
    elasticInDown: {
      initial: { opacity: 0, transform: 'translateY(-100px) scale(0.8)' },
      animate: { opacity: 1, transform: 'translateY(0px) scale(1)' },
      transition: { duration: 1000, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
    },

    // Blur Animations
    blurIn: {
      initial: { opacity: 0, filter: 'blur(10px)' },
      animate: { opacity: 1, filter: 'blur(0px)' },
      transition: { duration: 800, easing: 'ease-out' },
    },
    blurInUp: {
      initial: { opacity: 0, filter: 'blur(10px)', transform: 'translateY(50px)' },
      animate: { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' },
      transition: { duration: 800, easing: 'ease-out' },
    },

    // Skew Animations
    skewIn: {
      initial: { opacity: 0, transform: 'skewX(-20deg)' },
      animate: { opacity: 1, transform: 'skewX(0deg)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },
    skewInUp: {
      initial: { opacity: 0, transform: 'skewY(-20deg) translateY(50px)' },
      animate: { opacity: 1, transform: 'skewY(0deg) translateY(0px)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },

    // Complex Combined Animations
    rollIn: {
      initial: { opacity: 0, transform: 'translateX(-100px) rotate(-120deg)' },
      animate: { opacity: 1, transform: 'translateX(0px) rotate(0deg)' },
      transition: { duration: 1000, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },
    lightSpeedIn: {
      initial: { opacity: 0, transform: 'translateX(100px) skewX(-30deg)' },
      animate: { opacity: 1, transform: 'translateX(0px) skewX(0deg)' },
      transition: { duration: 600, easing: 'ease-out' },
    },
    jackInTheBox: {
      initial: { opacity: 0, transform: 'scale(0.1) rotate(30deg)' },
      animate: { opacity: 1, transform: 'scale(1) rotate(0deg)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
    },

    // Subtle Animations
    gentle: {
      initial: { opacity: 0, transform: 'translateY(20px)' },
      animate: { opacity: 1, transform: 'translateY(0px)' },
      transition: { duration: 500, easing: 'ease-out' },
    },
    soft: {
      initial: { opacity: 0, transform: 'scale(0.95)' },
      animate: { opacity: 1, transform: 'scale(1)' },
      transition: { duration: 400, easing: 'ease-out' },
    },
    smooth: {
      initial: { opacity: 0, transform: 'translateY(10px)' },
      animate: { opacity: 1, transform: 'translateY(0px)' },
      transition: { duration: 300, easing: 'ease-out' },
    },

    // Dramatic Animations
    dramatic: {
      initial: { opacity: 0, transform: 'scale(0.5) rotate(-180deg)' },
      animate: { opacity: 1, transform: 'scale(1) rotate(0deg)' },
      transition: { duration: 1200, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
    },
    explosive: {
      initial: { opacity: 0, transform: 'scale(0.1) rotate(180deg)' },
      animate: { opacity: 1, transform: 'scale(1) rotate(0deg)' },
      transition: { duration: 800, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
    },
  };