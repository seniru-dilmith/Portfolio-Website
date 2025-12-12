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
    // project with a 'src' directory
    '^@/(.*)$': '<rootDir>/src/$1',
    // Mock CSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Mock Swiper CSS imports
    '^swiper/css.*$': 'identity-obj-proxy',
    '^@mdxeditor/editor$': '<rootDir>/src/__mocks__/mdxeditor.tsx',
    'rehype-raw': '<rootDir>/src/__mocks__/styleMock.js',
    'remark-gfm': '<rootDir>/src/__mocks__/styleMock.js',
  },

  // use babel-jest to transform all JS/TS files
  transform: {
    // tuple, not a generic array
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }] as const,
  },

  // which node_modules to transform
  transformIgnorePatterns: [
      // Allow Swiper ESM modules to be transformed
      '/node_modules/(?!remark|react-markdown|unified|unist-.*|hast-.*|bail|trough|vfile.*|micromark.*|decode-named-character-reference|character-entities|mdast-util-.*|escape-string-regexp|markdown-table|github-slugger|strip-markdown|remark-gfm|rehype-raw|swiper|@mdxeditor)/',
      '^.+\\.module\\.(css|sass|scss)$',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
