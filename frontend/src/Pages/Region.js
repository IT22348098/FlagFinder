//region.js
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  User,
  HelpCircle,
  ChevronDown,
  Globe,
  Filter,
  Bookmark,
  Star,
  ListTodo,
} from "lucide-react";
import { useSession } from "./SessionManager"; // Import our session hook

export default function FlagFinderRegions() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSession(); // Use our session hook

  // States for countries data and loading
  const [allCountries, setAllCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [regions, setRegions] = useState(["All"]);
  const [languages, setLanguages] = useState(["All"]);

  // State for dropdowns
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // Parse URL query parameters on component mount and when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const regionParam = params.get("region");
    const languageParam = params.get("language");
    const searchParam = params.get("search");

    if (regionParam) setSelectedRegion(regionParam);
    if (languageParam) setSelectedLanguage(languageParam);
    if (searchParam) setSearchTerm(searchParam);
  }, [location.search]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedRegion && selectedRegion !== "All")
      params.append("region", selectedRegion);
    if (selectedLanguage && selectedLanguage !== "All")
      params.append("language", selectedLanguage);
    if (searchTerm) params.append("search", searchTerm);

    const query = params.toString();
    const newUrl = query ? `?${query}` : "";

    // Use replace to avoid creating new history entries for filter changes
    navigate(newUrl, { replace: true });
  }, [selectedRegion, selectedLanguage, searchTerm, navigate]);

  // Fetch all countries initially to get regions and languages
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Include languages field in the API request
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,region,languages"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }

        const data = await response.json();

        // Extract unique regions
        const uniqueRegions = [
          "All",
          ...new Set(data.map((country) => country.region)),
        ];
        setRegions(uniqueRegions);

        // Extract unique languages
        const allLanguages = data.flatMap((country) =>
          country.languages ? Object.values(country.languages) : []
        );
        const uniqueLanguages = ["All", ...new Set(allLanguages)];
        setLanguages(uniqueLanguages.sort());
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError(err.message);
      } finally {
        // We'll load countries separately, so don't set loading to false here
      }
    };

    fetchInitialData();
  }, []);

  // Fetch countries based on filters
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        let url;
        const fields = "?fields=name,region,flags,cca3,languages";

        // Determine which API endpoint to use based on filters
        if (selectedRegion && selectedRegion !== "All") {
          // Use the region endpoint
          url = `https://restcountries.com/v3.1/region/${selectedRegion}${fields}`;
        } else if (selectedLanguage && selectedLanguage !== "All") {
          // Use the language endpoint
          url = `https://restcountries.com/v3.1/lang/${selectedLanguage}${fields}`;
        } else {
          // Default to all countries
          url = `https://restcountries.com/v3.1/all${fields}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch countries: ${response.status}`);
        }

        const data = await response.json();

        // Format the data
        const formattedData = data.map((country) => {
          // Extract languages as an array
          const languagesArray = country.languages
            ? Object.values(country.languages)
            : [];

          return {
            name: country.name.common,
            region: country.region,
            image:
              country.flags.svg ||
              country.flags.png ||
              "/api/placeholder/400/320",
            cca3: country.cca3,
            languages: languagesArray,
          };
        });

        // Sort by name
        formattedData.sort((a, b) => a.name.localeCompare(b.name));

        setAllCountries(formattedData);

        // Start with all fetched countries
        let filtered = [...formattedData];

        // Apply additional filters that weren't handled by the API endpoint
        if (
          selectedRegion &&
          selectedRegion !== "All" &&
          selectedLanguage &&
          selectedLanguage !== "All"
        ) {
          // If both region and language are selected, we need to filter further
          // (we already filtered by one through the API)
          filtered = filtered.filter((country) =>
            country.languages.some(
              (lang) => lang.toLowerCase() === selectedLanguage.toLowerCase()
            )
          );
        }

        // Apply search filter
        if (searchTerm) {
          filtered = filtered.filter((country) =>
            country.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setFilteredCountries(filtered);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    // Only fetch if we have regions and languages loaded
    if (regions.length > 1 && languages.length > 1) {
      fetchCountries();
    }
  }, [
    selectedRegion,
    selectedLanguage,
    searchTerm,
    regions.length,
    languages.length,
  ]);

  // Handler for select button click
  const handleSelectCountry = (country) => {
    console.log("Selected country:", country);
    if (country && country.cca3) {
      // Track the visited country in session
      console.log(country);
      session.addVisitedCountry({
        cca3: country.cca3,
        name: country.name,
        flag: country.image,
        timestamp: new Date().toISOString(),
      });
      // Navigate to the detail page with the cca3 code
      navigate(`/country/${country.cca3}`);
    } else {
      console.error("Country or cca3 is undefined:", country);
      // Fallback in case cca3 is missing
      alert("Sorry, country code is missing. Please try another country.");
    }
  };

  // Toggle bookmark status
  const toggleBookmark = (e, country) => {
    e.stopPropagation(); // Prevent triggering parent click event

    if (session.isBookmarked(country.cca3)) {
      session.removeBookmark(country.cca3);
    } else {
      console.log("here");
      session.bookmarkCountry({
        cca3: country.cca3,
        name: country.name,
        flag: country.image,
        timestamp: new Date().toISOString(),
      });
      console.log("there");
    }
  };

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".region-dropdown") && isRegionDropdownOpen) {
        setIsRegionDropdownOpen(false);
      }
      if (
        !event.target.closest(".language-dropdown") &&
        isLanguageDropdownOpen
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isRegionDropdownOpen, isLanguageDropdownOpen]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedRegion("All");
    setSelectedLanguage("All");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center mr-6">
              <Globe className="w-6 h-6 text-indigo-500" />
              <span className="ml-2 text-xl font-bold">Flag Finder</span>
            </div>
            <nav className="hidden sm:flex space-x-8">
              <a href="/" className="text-gray-500 hover:text-gray-900">
                Home
              </a>
              <a
                href="/search"
                className="text-indigo-600 border-b-2 border-indigo-600 pb-1"
              >
                Search
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {/* Bookmarks button with counter */}
            <button
              className="relative border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 flex items-center"
              onClick={() => navigate("/bookmarks")}
            >
              <Bookmark className="h-4 w-4 mr-1" />
              Bookmarks
              {session.bookmarkedCountries.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {session.bookmarkedCountries.length}
                </span>
              )}
            </button>

            {/* History button */}
            <button
              className="border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 flex items-center"
              onClick={() => navigate("/history")}
            >
              <ListTodo className="h-4 w-4 mr-1" />
              History
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Search and Filter Section */}
          <div className="mb-8">
            <div className="max-w-md mx-auto mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {/* Desktop Filter Buttons */}
              <div className="hidden md:flex flex-wrap justify-center gap-2">
                <span className="self-center font-medium text-gray-700">
                  Region:
                </span>
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      selectedRegion === region
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>

              <div className="hidden md:flex flex-wrap justify-center gap-2">
                <span className="self-center font-medium text-gray-700">
                  Language:
                </span>
                <div className="relative inline-block language-dropdown">
                  <button
                    onClick={() =>
                      setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                    }
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center gap-2"
                  >
                    {selectedLanguage || "All Languages"}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {isLanguageDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-56 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                      {languages.map((language) => (
                        <button
                          key={language}
                          onClick={() => {
                            setSelectedLanguage(language);
                            setIsLanguageDropdownOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                            selectedLanguage === language
                              ? "bg-indigo-50 text-indigo-600"
                              : ""
                          }`}
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Reset Filters Button */}
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Reset Filters
              </button>
            </div>

            {/* Mobile Filters */}
            <div className="md:hidden space-y-4 mb-6">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Status */}
            <div className="flex justify-center items-center text-sm text-gray-500 mb-4">
              {filteredCountries.length > 0 && (
                <p>
                  Showing {filteredCountries.length}{" "}
                  {filteredCountries.length === 1 ? "country" : "countries"}
                  {selectedRegion && selectedRegion !== "All"
                    ? ` in ${selectedRegion}`
                    : ""}
                  {selectedLanguage && selectedLanguage !== "All"
                    ? ` speaking ${selectedLanguage}`
                    : ""}
                </p>
              )}
            </div>
          </div>

          {/* Countries Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading state
              Array(8)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
                  >
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="mt-auto h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))
            ) : error ? (
              // Error state
              <div className="col-span-full py-12 text-center text-red-500">
                <p className="text-lg font-medium">Error loading countries</p>
                <p className="mt-2">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                >
                  Try Again
                </button>
              </div>
            ) : filteredCountries.length > 0 ? (
              // Countries list
              filteredCountries.map((country, index) => (
                <div
                  key={index}
                  className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden relative"
                >
                  {/* Bookmark button */}
                  <button
                    className="absolute right-3 top-3 z-10 p-1 rounded-full bg-white bg-opacity-70"
                    onClick={(e) => toggleBookmark(e, country)}
                  >
                    {session.isBookmarked(country.cca3) ? (
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    ) : (
                      <Star className="w-5 h-5 text-gray-700" />
                    )}
                  </button>

                  <div className="aspect-w-4 aspect-h-3 rounded-t-lg overflow-hidden mb-2">
                    <img
                      src={country.image}
                      alt={`${country.name} flag`}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/400/320";
                        e.target.alt = "Flag image unavailable";
                      }}
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-medium text-lg">{country.name}</h3>
                    <p className="text-gray-500 text-sm mb-1">
                      {country.region}
                    </p>
                    {country.languages && country.languages.length > 0 && (
                      <p className="text-gray-500 text-sm mb-2">
                        <span className="font-medium">Languages:</span>{" "}
                        {country.languages.slice(0, 3).join(", ")}
                        {country.languages.length > 3 && " ..."}
                      </p>
                    )}
                    <button
                      onClick={() => handleSelectCountry(country)}
                      className="mt-auto py-2 px-4 border border-indigo-500 text-indigo-500 rounded-md hover:bg-indigo-50 transition-colors text-center"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))
            ) : (
              // No results state
              <div className="col-span-full py-12 text-center text-gray-500">
                <p className="text-lg font-medium">
                  No countries found matching your criteria
                </p>
                <p className="mt-2">Try adjusting your search or filters</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
