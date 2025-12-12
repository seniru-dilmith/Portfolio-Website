import '@testing-library/jest-dom';
import React from 'react';

// It mocks the 'matchMedia' browser API.
// Many modern UI components use this to check for screen size or user preferences,
// and it doesn't exist in Jest's simulated environment by default.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated but still used
    removeListener: jest.fn(), // Deprecated but still used
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock framer-motion to discard animation props that cause React warnings in tests
jest.mock('framer-motion', () => {
  const original = jest.requireActual('framer-motion');
  const discardProps = (props: any) => {
    // Remove animation/boolean props that cause warnings
    // Add more as needed
    const { whileHover, whileTap, whileInView, layout, transition, animate, initial, exit, variants, viewport, ...rest } = props;
    return rest;
  };
  return {
    ...original,
    motion: new Proxy(original.motion, {
      get(target, prop) {
        return (props: any) => {
          const Comp = target[prop] || 'div';
          return React.createElement(Comp, discardProps(props));
        };
      },
    }),
  };
});

// Mock next/image to discard boolean props that cause React warnings in tests
const MockedImage = (props: any) => {
  const { fill, priority, ...rest } = props;
  return React.createElement('img', rest);
};
MockedImage.displayName = 'MockedImage';
jest.mock('next/image', () => MockedImage);

// Suppress specific React warnings about animation/boolean props on DOM elements in test output
const suppressedWarnings = [
  'React does not recognize the',
  'Received `true` for a non-boolean attribute',
];
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && suppressedWarnings.some(w => args[0].includes(w))) {
    return;
  }
  originalError(...args);
};