import type { Config } from 'jest';
import nextJest from 'next/jest.js';

// next/jest loads next.config + .env files, compiles TS/TSX with Next's SWC
// transform and stubs CSS/image imports, so tests run like the Next.js app does.
const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // stub Next.js internals & CSS
    '^next/navigation$': '<rootDir>/src/__mocks__/next/navigation.ts',
    '\\.css$': '<rootDir>/src/__mocks__/styleMock.ts',
  },
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/__mocks__/**'],
};

export default createJestConfig(config);
