import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import HomePage from "../Homepage";

// Mock the react-router-dom hooks
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

// Mock different browser user agents
const browserMocks = {
  chrome:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
  firefox:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
  safari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15",
  edge: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36 Edg/96.0.1054.34",
};

describe("Browser Compatibility Tests", () => {
  const originalUserAgent = navigator.userAgent;

  // Reset user agent after tests
  afterAll(() => {
    Object.defineProperty(navigator, "userAgent", {
      value: originalUserAgent,
      configurable: true,
    });
  });

  Object.entries(browserMocks).forEach(([browser, userAgent]) => {
    test(`HomePage renders correctly in ${browser}`, () => {
      // Mock the user agent
      Object.defineProperty(navigator, "userAgent", {
        value: userAgent,
        configurable: true,
      });

      const { container } = render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );

      // Check if the component renders without errors
      expect(container).toBeInTheDocument();
      expect(container.innerHTML).not.toBe("");
    });
  });
});
