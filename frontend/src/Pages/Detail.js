import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Globe,
  ArrowLeft,
  Languages,
  Map,
  Users,
  Currency,
  Home,
  Bookmark,
  Star,
  ListTodo
} from "lucide-react";
import { useSession } from "./SessionManager"; // Import the session hook

export default function CountryDetail() {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const session = useSession(); // Use the session hook
  
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  
  // Fetch country details
  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);
        // Fetch country by code
        const response = await fetch(
          `https://restcountries.com/v3.1/alpha/${countryCode}?fields=name,flags,region,subregion,capital,population,languages,currencies,borders,cca3`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch country: ${response.status}`);
        }
        
        const data = await response.json();
        setCountry(data);
        
        // Fetch border countries if any
        if (data.borders && data.borders.length > 0) {
          const borderResponse = await fetch(
            `https://restcountries.com/v3.1/alpha?codes=${data.borders.join(',')}&fields=name,flags,cca3`
          );
          
          if (!borderResponse.ok) {
            throw new Error(`Failed to fetch border countries: ${borderResponse.status}`);
          }
          
          const borderData = await borderResponse.json();
          setBorderCountries(borderData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching country:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    if (countryCode) {
      fetchCountry();
    }
  }, [countryCode]);
  
  // Toggle bookmark status
  const toggleBookmark = (e) => {
    e.stopPropagation();
    
    if (country) {
      if (session.isBookmarked(country.cca3)) {
        session.removeBookmark(country.cca3);
      } else {
        session.bookmarkCountry({
          cca3: country.cca3,
          name: country.name.common,
          flag: country.flags.svg || country.flags.png,
          timestamp: new Date().toISOString(),
        });
      }
    }
  };
  
  // Handle border country selection - this is the key new function
  const handleBorderCountrySelect = (borderCountry) => {
    if (borderCountry && borderCountry.cca3) {
      // Track the visited border country in session history
      session.addVisitedCountry({
        cca3: borderCountry.cca3,
        name: borderCountry.name.common,
        flag: borderCountry.flags.svg || borderCountry.flags.png,
        timestamp: new Date().toISOString(),
      });
      
      // Navigate to the detail page for the selected border country
      navigate(`/country/${borderCountry.cca3}`);
    } else {
      console.error("Border country or cca3 is undefined:", borderCountry);
      alert("Sorry, country code is missing. Please try another country.");
    }
  };
  
  // Other functions and UI rendering...
  
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
              <a href="/search" className="text-gray-500 hover:text-gray-900">
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
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 mb-6 hover:text-indigo-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>

          {loading ? (
            // Loading state
            <div className="flex flex-col animate-pulse">
              <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : error ? (
            // Error state
            <div className="py-12 text-center text-red-500">
              <p className="text-lg font-medium">Error loading country details</p>
              <p className="mt-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
              >
                Try Again
              </button>
            </div>
          ) : country ? (
            // Country details
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Country header with flag and bookmark button */}
              <div className="relative">
                <img
                  src={country.flags.svg || country.flags.png}
                  alt={`${country.name.common} flag`}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/800/300";
                    e.target.alt = "Flag image unavailable";
                  }}
                />
                <button
                  className="absolute right-4 top-4 p-2 rounded-full bg-white bg-opacity-70"
                  onClick={toggleBookmark}
                >
                  {session.isBookmarked(country.cca3) ? (
                    <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                  ) : (
                    <Star className="w-6 h-6 text-gray-700" />
                  )}
                </button>
              </div>

              {/* Country information */}
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">{country.name.common}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Left column */}
                  <div>
                    <div className="mb-4">
                      <p className="flex items-center text-gray-700 mb-2">
                        <Map className="w-5 h-5 mr-2 text-indigo-500" />
                        <span className="font-medium">Region:</span>
                        <span className="ml-2">{country.region}</span>
                      </p>
                      {country.subregion && (
                        <p className="flex items-center text-gray-700 mb-2">
                          <Map className="w-5 h-5 mr-2 text-indigo-500" />
                          <span className="font-medium">Subregion:</span>
                          <span className="ml-2">{country.subregion}</span>
                        </p>
                      )}
                      {country.capital && (
                        <p className="flex items-center text-gray-700">
                          <Home className="w-5 h-5 mr-2 text-indigo-500" />
                          <span className="font-medium">Capital:</span>
                          <span className="ml-2">{country.capital.join(", ")}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right column */}
                  <div>
                    {country.population && (
                      <p className="flex items-center text-gray-700 mb-2">
                        <Users className="w-5 h-5 mr-2 text-indigo-500" />
                        <span className="font-medium">Population:</span>
                        <span className="ml-2">
                          {new Intl.NumberFormat().format(country.population)}
                        </span>
                      </p>
                    )}
                    {country.currencies && (
                      <p className="flex items-center text-gray-700 mb-2">
                        <Currency className="w-5 h-5 mr-2 text-indigo-500" />
                        <span className="font-medium">Currencies:</span>
                        <span className="ml-2">
                          {Object.values(country.currencies)
                            .map((currency) => `${currency.name} (${currency.symbol || ''})`)
                            .join(", ")}
                        </span>
                      </p>
                    )}
                    {country.languages && (
                      <p className="flex items-start text-gray-700">
                        <Languages className="w-5 h-5 mr-2 mt-1 text-indigo-500" />
                        <span className="font-medium mr-2">Languages:</span>
                        <span>
                          {Object.values(country.languages).join(", ")}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Border Countries Section */}
                {borderCountries.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Border Countries</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {borderCountries.map((border) => (
                        <div
                          key={border.cca3}
                          className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleBorderCountrySelect(border)}
                        >
                          <img
                            src={border.flags.svg || border.flags.png}
                            alt={`${border.name.common} flag`}
                            className="w-full h-24 object-cover"
                            onError={(e) => {
                              e.target.src = "/api/placeholder/200/100";
                              e.target.alt = "Flag image unavailable";
                            }}
                          />
                          <div className="p-2 text-center">
                            <p className="font-medium text-sm truncate">
                              {border.name.common}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // No country data
            <div className="py-12 text-center text-gray-500">
              <p className="text-lg font-medium">Country not found</p>
              <button
                onClick={() => navigate('/search')}
                className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
              >
                Go to Search
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}