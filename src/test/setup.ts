// Test setup file for Vitest
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock IntersectionObserver for testing

(
  globalThis as typeof globalThis & { IntersectionObserver: any }
).IntersectionObserver = vi.fn().mockImplementation(_callback => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

// Mock window.matchMedia for motion preference testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
