import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FlagFinderLandingPage from "../Homepage";

// Mock navigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

// Mock Footer component
jest.mock("../Components/Footer", () => () => <div data-testid="footer" />);

// Sample mock data for countries
const mockCountries = [
  {
    cca3: "USA",
    name: { common: "United States", official: "United States of America" },
    capital: ["Washington, D.C."],
    region: "Americas",
    population: 331000000,
    flags: { svg: "usa.svg", png: "usa.png" },
  },
  {
    cca3: "FRA",
    name: { common: "France", official: "French Republic" },
    capital: ["Paris"],
    region: "Europe",
    population: 67000000,
    flags: { svg: "france.svg", png: "france.png" },
  },
  {
    cca3: "JPN",
    name: { common: "Japan", official: "Japan" },
    capital: ["Tokyo"],
    region: "Asia",
    population: 125000000,
    flags: { svg: "japan.svg", png: "japan.png" },
  },
];

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockCountries),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

test("renders landing page and fetches countries", async () => {
  render(
    <MemoryRouter>
      <FlagFinderLandingPage />
    </MemoryRouter>
  );

  expect(screen.getByText(/Explore the World/i)).toBeInTheDocument();

  // Wait for featured countries to load
  await waitFor(() =>
    expect(screen.getByText(/Featured Countries/i)).toBeInTheDocument()
  );

  // Should render at least one featured country name
  const countries = await screen.findAllByText(/United States|France|Japan/);
  expect(countries.length).toBeGreaterThan(0);
  

});

test("search input filters countries", async () => {
  render(
    <MemoryRouter>
      <FlagFinderLandingPage />
    </MemoryRouter>
  );

  await waitFor(() =>
    expect(screen.getByText(/Featured Countries/i)).toBeInTheDocument()
  );

  const searchInput = screen.getByPlaceholderText(/Search for a country/i);
  fireEvent.change(searchInput, { target: { value: "france" } });

  await waitFor(() => {
    const matches = screen.getAllByText(/France/);
    expect(matches.length).toBeGreaterThan(0);
  });
});

test("displays error on failed fetch", async () => {
  global.fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));

  render(
    <MemoryRouter>
      <FlagFinderLandingPage />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/Failed to fetch countries/i)).toBeInTheDocument();
  });
});
