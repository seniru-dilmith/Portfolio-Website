import '@testing-library/jest-dom';

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