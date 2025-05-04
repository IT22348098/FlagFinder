import "@testing-library/jest-dom";
import { server } from "./mocks/server";

// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock getComputedStyle for the responsiveness tests
window.getComputedStyle = jest.fn().mockImplementation((element) => {
  return {
    getPropertyValue: (prop) => {
      return "";
    },
    flexDirection: "column", // Default value for tests
  };
});

// Helper function for testing computed width
window.getComputedWidth = jest.fn().mockImplementation((element) => {
  return element?.style?.width || "";
});
