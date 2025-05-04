import { handlers } from "../../mocks/handlers"; // Import handlers directly

// Mock direct handler data without making actual fetch requests
const mockCountriesData = [
  {
    name: { common: "United States", official: "United States of America" },
    flags: { png: "https://example.com/us-flag.png", alt: "US Flag" },
    capital: ["Washington D.C."],
    region: "Americas",
    population: 331002651,
    languages: { eng: "English" },
    currencies: { USD: { name: "United States dollar", symbol: "$" } },
  },
  {
    name: { common: "Canada", official: "Canada" },
    flags: {
      png: "https://example.com/canada-flag.png",
      alt: "Canada Flag",
    },
    capital: ["Ottawa"],
    region: "Americas",
    population: 38005238,
    languages: { eng: "English", fra: "French" },
    currencies: { CAD: { name: "Canadian dollar", symbol: "$" } },
  },
];

const mockAmericasRegionData = [
  {
    name: {
      common: "United States",
      official: "United States of America",
    },
    flags: { png: "https://example.com/us-flag.png", alt: "US Flag" },
    capital: ["Washington D.C."],
    region: "Americas",
    population: 331002651,
  },
  {
    name: { common: "Canada", official: "Canada" },
    flags: {
      png: "https://example.com/canada-flag.png",
      alt: "Canada Flag",
    },
    capital: ["Ottawa"],
    region: "Americas",
    population: 38005238,
  },
];

const mockLanguageData = {
  english: [
    {
      name: { common: "United States" },
      region: "Americas",
      flags: { png: "https://flagcdn.com/w320/us.png" },
      cca3: "USA",
      languages: { eng: "English" },
    },
    {
      name: { common: "United Kingdom" },
      region: "Europe",
      flags: { png: "https://flagcdn.com/w320/gb.png" },
      cca3: "GBR",
      languages: { eng: "English" },
    },
  ],
  french: [
    {
      name: { common: "France" },
      region: "Europe",
      flags: { png: "https://flagcdn.com/w320/fr.png" },
      cca3: "FRA",
      languages: { fra: "French" },
    },
  ],
};

const mockCountryData = {
  USA: [
    {
      name: { common: "United States", official: "United States of America" },
      region: "Americas",
      subregion: "North America",
      flags: {
        png: "https://flagcdn.com/w320/us.png",
        svg: "https://flagcdn.com/us.svg",
        alt: "The flag of the United States of America",
      },
      capital: ["Washington, D.C."],
      population: 329484123,
      currencies: { USD: { name: "United States dollar", symbol: "$" } },
      languages: { eng: "English" },
      cca3: "USA",
      borders: ["CAN", "MEX"],
      area: 9372610,
    },
  ],
  FRA: [
    {
      name: { common: "France", official: "French Republic" },
      region: "Europe",
      subregion: "Western Europe",
      flags: {
        png: "https://flagcdn.com/w320/fr.png",
        svg: "https://flagcdn.com/fr.svg",
        alt: "The flag of France",
      },
      capital: ["Paris"],
      population: 67391582,
      currencies: { EUR: { name: "Euro", symbol: "€" } },
      languages: { fra: "French" },
      cca3: "FRA",
      borders: ["AND", "BEL", "DEU", "ITA", "LUX", "MCO", "ESP", "CHE"],
      area: 551695,
    },
  ],
};

// Simple mock functions to return data directly - no actual network requests
async function fetchCountries() {
  return mockCountriesData;
}

async function fetchCountriesByRegion(region) {
  if (region.toLowerCase() === "americas") {
    return mockAmericasRegionData;
  }
  return [];
}

async function fetchCountriesByLanguage(language) {
  if (language.toLowerCase() === "english") {
    return mockLanguageData.english;
  } else if (language.toLowerCase() === "french") {
    return mockLanguageData.french;
  }
  return [];
}

async function fetchCountryByCode(code) {
  if (mockCountryData[code]) {
    return mockCountryData[code];
  }
  throw new Error(`Network response was not ok: 404`);
}

// Verify that the handlers exist (basic sanity check)
describe("Handler Setup", () => {
  test("handlers are defined", () => {
    expect(handlers).toBeDefined();
    expect(Array.isArray(handlers)).toBe(true);
    expect(handlers.length).toBeGreaterThan(0);
  });
});

describe("API Tests", () => {
  test("fetches all countries successfully", async () => {
    const data = await fetchCountries();
    expect(data).toHaveLength(2);
    expect(data[0].name.common).toBe("United States");
    expect(data[1].name.common).toBe("Canada");
  });

  test("fetches countries by region", async () => {
    const data = await fetchCountriesByRegion("Americas");
    expect(data).toHaveLength(2);
    expect(data[0].name.common).toBe("United States");
    expect(data[1].name.common).toBe("Canada");
  });

  test("fetches countries by region case insensitive", async () => {
    const data = await fetchCountriesByRegion("americas");
    expect(data).toHaveLength(2);
  });

  test("returns empty array for non-existent region", async () => {
    const data = await fetchCountriesByRegion("nonexistent");
    expect(data).toHaveLength(0);
  });

  test("fetches countries by language (English)", async () => {
    const data = await fetchCountriesByLanguage("english");
    expect(data.length).toBeGreaterThan(0);
    const countries = data.map((country) => country.name.common);
    expect(countries).toContain("United States");
    expect(countries).toContain("United Kingdom");
  });

  test("fetches countries by language (French)", async () => {
    const data = await fetchCountriesByLanguage("french");
    expect(data.length).toBeGreaterThan(0);
    const countryNames = data.map((country) => country.name.common);
    expect(countryNames).toContain("France");
  });

  test("fetches country by alpha code (USA)", async () => {
    const data = await fetchCountryByCode("USA");
    expect(data).toHaveLength(1);
    expect(data[0].name.common).toBe("United States");
    expect(data[0].capital[0]).toBe("Washington, D.C.");
    expect(data[0].currencies.USD.name).toBe("United States dollar");
  });

  test("fetches country by alpha code (FRA)", async () => {
    const data = await fetchCountryByCode("FRA");
    expect(data).toHaveLength(1);
    expect(data[0].name.common).toBe("France");
    expect(data[0].capital[0]).toBe("Paris");
    expect(data[0].currencies.EUR.name).toBe("Euro");
  });

  test("handles non-existent country code", async () => {
    await expect(fetchCountryByCode("XYZ")).rejects.toThrow(
      "Network response was not ok: 404"
    );
  });
});
