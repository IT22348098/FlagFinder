import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ListTodo,
  Search,
  Globe,
  Flag,
  Bookmark,
  Star,
  X,
} from "lucide-react";
import Footer from "./Components/Footer";
import { useSession } from "./SessionManager"; // Import our session hook

export default function FlagFinderLandingPage() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [featuredCountries, setFeaturedCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRecents, setShowRecents] = useState(false);

  // Use our session hook to access session data and functions
  const session = useSession();

  // Fetch all countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://restcountries.com/v3.1/all");

        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }

        const data = await response.json();
        setCountries(data);

        // Logic for featured countries - prioritize bookmarks if available
        if (session.bookmarkedCountries.length >= 3) {
          // Use bookmarked countries as featured
          const bookmarkedDetails = session.bookmarkedCountries
            .slice(0, 3)
            .map((bookmark) => {
              return data.find((country) => country.cca3 === bookmark.cca3);
            })
            .filter((country) => country !== undefined);

          setFeaturedCountries(bookmarkedDetails);
        } else {
          // Mix bookmarks with random countries
          const bookmarkedDetails = session.bookmarkedCountries
            .map((bookmark) => {
              return data.find((country) => country.cca3 === bookmark.cca3);
            })
            .filter((country) => country !== undefined);

          // Get random countries for remaining slots
          const remainingCount = 3 - bookmarkedDetails.length;
          const nonBookmarkedCountries = data.filter(
            (country) =>
              !session.bookmarkedCountries.some((b) => b.cca3 === country.cca3)
          );

          const randomCountries = [...nonBookmarkedCountries]
            .sort(() => 0.5 - Math.random())
            .slice(0, remainingCount);

          setFeaturedCountries([...bookmarkedDetails, ...randomCountries]);
        }

        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, [session.bookmarkedCountries]); // Re-run when bookmarks change

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowRecents(e.target.value === ""); // Show recents only when search is empty
  };

  // Handle search submission
  const handleSearch = (term) => {
    session.addSearchTerm(term || searchTerm);
    // Continue with search functionality
  };

  // Filter countries based on search term
  const filteredCountries = searchTerm
    ? countries.filter(
        (country) =>
          country.name.common
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (country.name.official &&
            country.name.official
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      )
    : [];

  // Updated handleLearnMore function to navigate to detail page and track visit
  const handleLearnMore = (country) => {
    session.addVisitedCountry(country);
    navigate(`/country/${country.cca3}`);
  };

  // Add click handler for search results
  const handleCountryClick = (country) => {
    session.addVisitedCountry(country);
    navigate(`/country/${country.cca3}`);
  };

  // Toggle bookmark status
  const toggleBookmark = (e, country) => {
    e.stopPropagation(); // Prevent triggering parent click event

    if (session.isBookmarked(country.cca3)) {
      session.removeBookmark(country.cca3);
    } else {
      session.bookmarkCountry(country);
    }
  };

  // Handle clicking on a recent search
  const handleRecentSearchClick = (term) => {
    setSearchTerm(term);
    handleSearch(term);
    setShowRecents(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="bg-white py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Flag Finder</span>
          </div>

          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-blue-600 font-medium">
              Home
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Search
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Regions
            </a>
          </nav>

          <div className="flex items-center space-x-3">
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

            <button className="bg-blue-600 rounded-full px-4 py-1 text-sm text-white flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Help
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-80">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/assets/world.jpg')",
            filter: "brightness(0.4)",
          }}
        ></div>
        <div className="relative h-full flex flex-col justify-center px-6 md:px-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Explore the World!
          </h1>
          <p className="text-white text-lg mb-6">
            Discover the diverse cultures and flags of {countries.length}{" "}
            countries around the globe.
          </p>
          <div className="flex space-x-4">
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-md shadow-md transition">
              Start Exploring
            </button>

            {/* Show this only if user has history */}
            {session.visitedCountries.length > 0 && (
              <button
                className="bg-white text-indigo-500 px-6 py-2 rounded-md shadow-md transition"
                onClick={() => navigate("/history")}
              >
                Continue Exploring
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto bg-gray-50 rounded-lg shadow-sm p-10">
          <h2 className="text-3xl font-bold text-indigo-500 mb-4 text-center">
            Find Your Flag
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Search for any country to discover its flag and key information.
          </p>

          <div className="relative">
            <input
              type="text"
              placeholder="Search for a country..."
              className="w-full border border-gray-300 rounded-md px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowRecents(searchTerm === "")}
              onBlur={() => setTimeout(() => setShowRecents(false), 200)}
            />
            <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            {searchTerm && (
              <button
                className="absolute right-3 top-3.5 text-gray-400"
                onClick={() => {
                  setSearchTerm("");
                  setShowRecents(true);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Recent searches dropdown */}
          {showRecents && session.recentSearches.length > 0 && (
            <div className="absolute z-10 mt-1 w-full max-w-3xl bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  Recent Searches
                </span>
                <button
                  className="text-xs text-red-500 hover:text-red-700"
                  onClick={session.clearSearchHistory}
                >
                  Clear
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {session.recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => handleRecentSearchClick(search.term)}
                  >
                    <Search className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{search.term}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchTerm && (
            <div className="mt-4 max-h-64 overflow-y-auto">
              {filteredCountries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCountries.slice(0, 6).map((country) => (
                    <div
                      key={country.cca3}
                      className="border border-gray-200 rounded-md p-4 flex items-center space-x-3 hover:bg-gray-100 cursor-pointer relative"
                      onClick={() => handleCountryClick(country)}
                    >
                      {country.flags && (
                        <img
                          src={country.flags.svg || country.flags.png}
                          alt={`Flag of ${country.name.common}`}
                          className="w-12 h-8 object-cover rounded shadow-sm"
                        />
                      )}
                      <div>
                        <h3 className="font-medium">{country.name.common}</h3>
                        <p className="text-sm text-gray-500">
                          {country.region}
                        </p>
                      </div>

                      {/* Bookmark button */}
                      <button
                        className="absolute right-3 top-3 text-gray-400 hover:text-yellow-500"
                        onClick={(e) => toggleBookmark(e, country)}
                      >
                        {session.isBookmarked(country.cca3) ? (
                          <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                        ) : (
                          <Star className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No countries found. Try a different search term.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Featured Countries - Now shows bookmarks if available */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            {session.bookmarkedCountries.length > 0
              ? "Your Bookmarked Countries"
              : "Featured Countries"}
          </h2>

          {session.bookmarkedCountries.length > 0 && (
            <p className="text-center text-gray-600 mb-8">
              Countries you've saved for quick access
            </p>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading countries...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredCountries.map((country) => (
                <div
                  key={country.cca3}
                  className="bg-white rounded-lg shadow-md overflow-hidden relative"
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

                  {country.flags && (
                    <img
                      src={country.flags.svg || country.flags.png}
                      alt={`Flag of ${country.name.common}`}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">
                      {country.name.common}
                    </h3>
                    <div className="text-gray-600 space-y-2">
                      <p>
                        <span className="font-medium">Capital:</span>{" "}
                        {country.capital ? country.capital[0] : "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Region:</span>{" "}
                        {country.region}
                      </p>
                      <p>
                        <span className="font-medium">Population:</span>{" "}
                        {country.population.toLocaleString()}
                      </p>
                    </div>
                    <button
                      className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md w-full"
                      onClick={() => handleLearnMore(country)}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View all bookmarks link if there are more than shown */}
          {session.bookmarkedCountries.length > 3 && (
            <div className="text-center mt-8">
              <button
                className="text-indigo-500 hover:text-indigo-700 font-medium"
                onClick={() => navigate("/bookmarks")}
              >
                View all {session.bookmarkedCountries.length} bookmarks &rarr;
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Recently Visited Section - Only show if there's history */}
      {session.visitedCountries.length > 0 && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">
              Recently Visited
            </h2>

            <div className="flex overflow-x-auto pb-4 space-x-4">
              {session.visitedCountries.slice(0, 5).map((visited) => {
                const country = countries.find((c) => c.cca3 === visited.cca3);
                if (!country) return null;

                return (
                  <div
                    key={visited.cca3}
                    className="flex-shrink-0 w-64 border border-gray-200 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleCountryClick(country)}
                  >
                    <img
                      src={visited.flag}
                      alt={`Flag of ${visited.name}`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-medium">{visited.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Visited{" "}
                        {new Date(visited.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {session.visitedCountries.length > 5 && (
              <div className="text-center mt-4">
                <button
                  className="text-indigo-500 hover:text-indigo-700 font-medium"
                  onClick={() => navigate("/history")}
                >
                  View full history &rarr;
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Use Flag Finder?
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-indigo-100">
                  <Globe className="w-6 h-6 text-indigo-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Global Database</h3>
              <p className="text-gray-600">
                Access information about every country in the world with our
                comprehensive database.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-indigo-100">
                  <Flag className="w-6 h-6 text-indigo-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Flag Collection</h3>
              <p className="text-gray-600">
                Explore and learn about flags from all around the world with
                high-quality SVG images.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-indigo-100">
                  <Bookmark className="w-6 h-6 text-indigo-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">
                Personalized Experience
              </h3>
              <p className="text-gray-600">
                Bookmark favorite countries, track your browsing history, and
                customize your experience - all without creating an account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Region Explorer Preview */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">
            Explore by Region
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Discover countries organized by their geographic regions
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {["Africa", "Americas", "Asia", "Europe", "Oceania"].map(
              (region) => (
                <div
                  key={region}
                  className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-lg mb-1">{region}</h3>
                  <p className="text-gray-500 text-sm mb-3">
                    {countries.filter((c) => c.region === region).length}{" "}
                    countries
                  </p>
                  <button
                    className="text-indigo-500 hover:text-indigo-700 text-sm font-medium"
                    onClick={() => navigate(`/region/${region.toLowerCase()}`)}
                  >
                    Explore &rarr;
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
