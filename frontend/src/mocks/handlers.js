    import { http, HttpResponse } from "msw";

    export const handlers = [
    http.get("https://restcountries.com/v3.1/all", () => {
        return HttpResponse.json([
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
        ]);
    }),

    // Mock GET request for countries by region
    http.get("https://restcountries.com/v3.1/region/:region", ({ params }) => {
        const { region } = params;

        if (region.toLowerCase() === "americas") {
        return HttpResponse.json([
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
        ]);
        }

        return HttpResponse.json([]);
    }),

    http.get("https://restcountries.com/v3.1/lang/:language", ({ params }) => {
        const language = params.language;

        const mockData = [
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
        {
            name: { common: "France" },
            region: "Europe",
            flags: { png: "https://flagcdn.com/w320/fr.png" },
            cca3: "FRA",
            languages: { fra: "French" },
        },
        ];

        // Filter mock data based on language
        const filteredData = mockData.filter((country) => {
        const countryLanguages = Object.values(country.languages || {});
        return countryLanguages.some(
            (lang) => lang.toLowerCase() === language.toLowerCase()
        );
        });

        return HttpResponse.json(filteredData);
    }),

    http.get("https://restcountries.com/v3.1/alpha/:code", ({ params }) => {
        const code = params.code;

        const mockData = {
        USA: {
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
        FRA: {
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
        };

        if (mockData[code]) {
        return HttpResponse.json([mockData[code]]);
        } else {
        return new HttpResponse(
            JSON.stringify({ message: "Country not found" }),
            {
            status: 404,
            headers: {
                "Content-Type": "application/json",
            },
            }
        );
        }
    }),
    ];
