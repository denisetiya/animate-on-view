/**
 * @copyright 2025 denisetiya
 * @license MIT
 */

import { writable } from 'svelte/store';

export const createIntersectionStore = () => {
  const { subscribe, set } = writable(false);
  
  return {
    subscribe,
    set,
  };
};