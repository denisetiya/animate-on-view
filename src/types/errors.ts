// Error handling types and constants

export class AnimationError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'AnimationError';
  }
}

export const ErrorCodes = {
  INVALID_DURATION: 'INVALID_DURATION',
  INVALID_DELAY: 'INVALID_DELAY',
  INVALID_OFFSET: 'INVALID_OFFSET',
  UNSUPPORTED_ANIMATION: 'UNSUPPORTED_ANIMATION',
  OBSERVER_NOT_SUPPORTED: 'OBSERVER_NOT_SUPPORTED',
  INVALID_ELEMENT: 'INVALID_ELEMENT',
  INVALID_CONFIG: 'INVALID_CONFIG',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
