import '@testing-library/jest-dom';
import { webcrypto } from 'node:crypto';

// jsdom does not implement SubtleCrypto; polyfill with Node's Web Crypto implementation.
if (typeof globalThis.crypto === 'undefined' || !globalThis.crypto.subtle) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    configurable: true,
  });
}
