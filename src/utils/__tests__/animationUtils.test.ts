// Tests for animation validation utilities
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validateDuration,
  validateDelay,
  validateOffset,
  validateAnimationType,
  validateAnimationDirection,
  validateEasing,
  validateAnimationConfig,
  normalizeAnimationConfig,
  validateElement,
} from '../animationUtils';
import { AnimationError, ErrorCodes } from '../../types/errors';

// Mock console methods for testing warnings
const mockConsoleWarn = vi.fn();
const mockConsoleError = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  // Mock console methods
  vi.spyOn(console, 'warn').mockImplementation(mockConsoleWarn);
  vi.spyOn(console, 'error').mockImplementation(mockConsoleError);
  // Set NODE_ENV to development for testing warnings
  process.env.NODE_ENV = 'development';
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('validateDuration', () => {
  it('should return true for valid durations', () => {
    expect(validateDuration(100)).toBe(true);
    expect(validateDuration(600)).toBe(true);
    expect(validateDuration(3000)).toBe(true);
  });

  it('should return false and warn for invalid durations', () => {
    expect(validateDuration(50)).toBe(false);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Duration 50ms is too short')
    );

    expect(validateDuration(5000)).toBe(false);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Duration 5000ms is too long')
    );
  });

  it('should return false and warn for non-numeric durations', () => {
    expect(validateDuration('600' as any)).toBe(false);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Duration must be a number')
    );

    expect(validateDuration(NaN)).toBe(false);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Duration must be a number')
    );
  });
});

describe('validateDelay', () => {
  it('should return true for valid delays', () => {
    expect(validateDelay(0)).toBe(true);
    expect(validateDelay(500)).toBe(true);
    expect(validateDelay(2000)).toBe(true);
  });

  it('should return false and warn for invalid delays', () => {
    expect(validateDelay(-100)).toBe(false);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Delay cannot be negative')
    );

    expect(validateDelay(3000)).toBe(false);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Delay 3000ms is too long')
    );
  });

  it('should return false and warn for non-numeric delays', () => {
    expect(validateDelay('500' as any)).toBe(false);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Delay must be a number')
    );
  });
});

describe('validateOffset', () => {
  it('should return true for valid offsets', () => {
    expect(validateOffset(0)).toBe(true);
    expect(validateOffset(100)).toBe(true);
    expect(validateOffset(-50)).toBe(true);
  });

  it('should warn for large offset values but still return true', () => {
    expect(validateOffset(1500)).toBe(true);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Large offset value (1500px)')
    );
  });

  it('should return false and warn for non-numeric offsets', () => {
    expect(validateOffset('100' as any)).toBe(false);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Offset must be a number')
    );
  });
});

describe('validateAnimationType', () => {
  it('should return true for valid animation types', () => {
    expect(validateAnimationType('fade')).toBe(true);
    expect(validateAnimationType('slide')).toBe(true);
    expect(validateAnimationType('zoom')).toBe(true);
    expect(validateAnimationType('flip')).toBe(true);
  });

  it('should return false and warn for invalid animation types', () => {
    expect(validateAnimationType('bounce' as any)).toBe(false);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Invalid animation type: "bounce"')
    );
  });
});

describe('validateAnimationDirection', () => {
  it('should return true for valid directions', () => {
    expect(validateAnimationDirection('up')).toBe(true);
    expect(validateAnimationDirection('down')).toBe(true);
    expect(validateAnimationDirection('left')).toBe(true);
    expect(validateAnimationDirection('right')).toBe(true);
  });

  it('should return false and warn for invalid directions', () => {
    expect(validateAnimationDirection('diagonal' as any)).toBe(false);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Invalid animation direction: "diagonal"')
    );
  });

  it('should warn when direction is used with fade animation', () => {
    expect(validateAnimationDirection('up', 'fade')).toBe(true);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Direction "up" has no effect on fade animations')
    );
  });
});

describe('validateEasing', () => {
  it('should return true for built-in easing functions', () => {
    expect(validateEasing('ease')).toBe(true);
    expect(validateEasing('ease-in')).toBe(true);
    expect(validateEasing('ease-out')).toBe(true);
    expect(validateEasing('ease-in-out')).toBe(true);
    expect(validateEasing('linear')).toBe(true);
  });

  it('should return true for valid cubic-bezier functions', () => {
    expect(validateEasing('cubic-bezier(0.25, 0.1, 0.25, 1)')).toBe(true);
    expect(validateEasing('cubic-bezier(0, 0, 1, 1)')).toBe(true);
  });

  it('should return false and warn for malformed cubic-bezier', () => {
    expect(validateEasing('cubic-bezier(0.25, 0.1, 0.25')).toBe(false);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Malformed cubic-bezier function')
    );
  });

  it('should return false and warn for invalid cubic-bezier values', () => {
    expect(validateEasing('cubic-bezier(a, b, c, d)')).toBe(false);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Invalid cubic-bezier values')
    );
  });

  it('should warn for potentially problematic cubic-bezier values', () => {
    expect(validateEasing('cubic-bezier(-0.5, 0, 1.5, 1)')).toBe(true);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Cubic-bezier x values should be between 0 and 1')
    );
  });

  it('should return false and warn for invalid easing functions', () => {
    expect(validateEasing('bounce')).toBe(false);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Invalid easing function: "bounce"')
    );
  });
});

describe('validateAnimationConfig', () => {
  it('should validate complete valid configuration without throwing', () => {
    const config = {
      type: 'fade' as const,
      duration: 600,
      delay: 100,
      easing: 'ease' as const,
      offset: 50,
      once: true,
      mirror: false,
    };

    expect(() => validateAnimationConfig(config)).not.toThrow();
  });

  it('should throw AnimationError for invalid type', () => {
    const config = {
      type: 'invalid' as any,
      duration: 600,
      delay: 0,
      easing: 'ease' as const,
      offset: 0,
      once: true,
      mirror: false,
    };

    expect(() => validateAnimationConfig(config)).toThrow(AnimationError);
    try {
      validateAnimationConfig(config);
    } catch (error) {
      expect(error).toBeInstanceOf(AnimationError);
      expect((error as AnimationError).code).toBe(
        ErrorCodes.UNSUPPORTED_ANIMATION
      );
    }
  });

  it('should throw AnimationError for invalid duration', () => {
    const config = {
      type: 'fade' as const,
      duration: 50,
      delay: 0,
      easing: 'ease' as const,
      offset: 0,
      once: true,
      mirror: false,
    };

    expect(() => validateAnimationConfig(config)).toThrow(AnimationError);
    try {
      validateAnimationConfig(config);
    } catch (error) {
      expect(error).toBeInstanceOf(AnimationError);
      expect((error as AnimationError).code).toBe(ErrorCodes.INVALID_DURATION);
    }
  });

  it('should warn about conflicting mirror and once settings', () => {
    const config = {
      type: 'fade' as const,
      duration: 600,
      delay: 0,
      easing: 'ease' as const,
      offset: 0,
      once: true,
      mirror: true,
    };

    validateAnimationConfig(config);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Mirror effect is ignored when "once" is true')
    );
  });
});

describe('normalizeAnimationConfig', () => {
  it('should return normalized config with defaults', () => {
    const result = normalizeAnimationConfig({});

    expect(result).toEqual({
      type: 'fade',
      direction: undefined,
      duration: 600,
      delay: 0,
      easing: 'ease',
      offset: 0,
      once: true,
      mirror: false,
    });
  });

  it('should preserve valid values', () => {
    const input = {
      type: 'slide' as const,
      direction: 'up' as const,
      duration: 1000,
      delay: 200,
    };

    const result = normalizeAnimationConfig(input);

    expect(result.type).toBe('slide');
    expect(result.direction).toBe('up');
    expect(result.duration).toBe(1000);
    expect(result.delay).toBe(200);
  });

  it('should fallback to safe defaults for invalid values', () => {
    const input = {
      type: 'invalid' as any,
      duration: 50,
      delay: -100,
      easing: 'invalid',
    };

    const result = normalizeAnimationConfig(input);

    expect(result.type).toBe('fade');
    expect(result.duration).toBe(100); // Clamped to minimum
    expect(result.delay).toBe(0); // Clamped to minimum
    expect(result.easing).toBe('ease');
  });

  it('should warn about invalid values in development', () => {
    normalizeAnimationConfig({
      type: 'invalid' as any,
      duration: 50,
    });

    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Invalid animation type "invalid"')
    );
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Invalid duration, clamped to')
    );
  });
});

describe('validateElement', () => {
  it('should return false and warn for null element', () => {
    expect(validateElement(null)).toBe(false);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Animation target element is null or undefined')
    );
  });

  it('should return false and warn for non-HTMLElement', () => {
    expect(validateElement({} as any)).toBe(false);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Animation target must be an HTMLElement')
    );
  });

  it('should return false and warn for disconnected element', () => {
    const element = document.createElement('div');
    // Element is not connected to DOM by default

    expect(validateElement(element)).toBe(false);
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining(
        'Animation target element is not connected to the DOM'
      )
    );
  });

  it('should return true for valid connected element', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    expect(validateElement(element)).toBe(true);

    // Cleanup
    document.body.removeChild(element);
  });
});

describe('production mode behavior', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'production';
    vi.clearAllMocks();
  });

  it('should not log warnings in production', () => {
    validateDuration(50);
    validateAnimationType('invalid' as any);
    normalizeAnimationConfig({ type: 'invalid' as any });

    expect(mockConsoleWarn).not.toHaveBeenCalled();
    expect(mockConsoleError).not.toHaveBeenCalled();
  });
});
