/**
 * @copyright 2025 denisetiya
 * @license MIT
 */

import React from 'react';

export interface AnimationVariant {
    initial: React.CSSProperties;
    animate: React.CSSProperties;
    transition?: {
      duration?: number;
      delay?: number;
      easing?: string;
    };
  }
  
  export type AnimationType = 
  // Basic Fade Animations
  | 'fadeIn' 
  | 'fadeInUp' 
  | 'fadeInDown' 
  | 'fadeInLeft' 
  | 'fadeInRight'
  // Slide Animations
  | 'slideUp' 
  | 'slideDown' 
  | 'slideLeft' 
  | 'slideRight'
  // Scale Animations
  | 'scaleIn' 
  | 'scaleOut' 
  | 'scaleX' 
  | 'scaleY'
  // Rotation Animations
  | 'rotateIn' 
  | 'rotateInLeft' 
  | 'rotateInRight'
  // Flip Animations
  | 'flipX' 
  | 'flipY'
  // Zoom Animations
  | 'zoomIn' 
  | 'zoomInUp' 
  | 'zoomInDown' 
  | 'zoomInLeft' 
  | 'zoomInRight'
  // Bounce Animations
  | 'bounceIn' 
  | 'bounceInUp' 
  | 'bounceInDown' 
  | 'bounceInLeft' 
  | 'bounceInRight'
  // Elastic Animations
  | 'elasticIn' 
  | 'elasticInUp' 
  | 'elasticInDown'
  // Blur Animations
  | 'blurIn' 
  | 'blurInUp'
  // Skew Animations
  | 'skewIn' 
  | 'skewInUp'
  // Complex Combined Animations
  | 'rollIn' 
  | 'lightSpeedIn' 
  | 'jackInTheBox'
  // Subtle Animations
  | 'gentle' 
  | 'soft' 
  | 'smooth'
  // Dramatic Animations
  | 'dramatic' 
  | 'explosive';

export interface BaseAnimateProps {
    type?: AnimationType;
    variant?: AnimationVariant;
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
    duration?: number;
    delay?: number;
    easing?: string;
    className?: string;
    style?: React.CSSProperties;
    onInView?: () => void;
    onOutView?: () => void;
  }

export interface AnimateProps extends BaseAnimateProps {
    children: React.ReactNode;
  }

export interface AnimateElementProps extends BaseAnimateProps {
    children?: React.ReactNode;
  }