import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CountryDetail from "../Detail";
import { server } from "../../mocks/server";
// At top level
let mockCountryCode = "USA";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ countryCode: mockCountryCode }),
  useNavigate: () => jest.fn(),
}));

// Setup MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("CountryDetail Component", () => {
  test("renders loading state initially", () => {
    mockCountryCode = "USA";

    render(
      <BrowserRouter>
        <CountryDetail />
      </BrowserRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test("renders country details after data is fetched", async () => {
    mockCountryCode = "USA";

    render(
      <BrowserRouter>
        <CountryDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/United States/i).length).toBeGreaterThan(0);
    });

    expect(screen.getAllByText(/Washington, D.C./i).length).toBeGreaterThan(0);
    expect(screen.getByText('Population')).toBeInTheDocument();


      
    expect(screen.getAllByText(/329,484,123/i).length).toBeGreaterThan(0);
  });

  test("displays error message when country is not found", async () => {
    mockCountryCode = "INVALID";

    render(
      <BrowserRouter>
        <CountryDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
        expect(screen.getByText(/Failed to fetch country details/i)).toBeInTheDocument();

    });
  });
});
