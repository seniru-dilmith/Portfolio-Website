import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  
  moduleNameMapper: {
    // This alias is correct for a project with a 'src' directory.
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // This explicitly tells Jest to use babel-jest to transform all JS/TS files.
  transform: {
    // The `as const` assertion tells TypeScript this is a tuple, not a generic array.
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }] as const,
  },

  // We still need this to tell Jest *which* node_modules to transform.
  transformIgnorePatterns: [
      '/node_modules/(?!remark|react-markdown|unified|unist-.*|hast-.*|bail|trough|vfile.*|micromark.*|decode-named-character-reference|character-entities|mdast-util-.*|escape-string-regexp|markdown-table|github-slugger|strip-markdown|remark-gfm)/',
      '^.+\\.module\\.(css|sass|scss)$',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
