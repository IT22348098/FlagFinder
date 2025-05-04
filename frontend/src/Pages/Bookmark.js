import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Star, ArrowLeft } from "lucide-react";
import { useSession } from "./SessionManager";

export default function BookmarksPage() {
  const navigate = useNavigate();
  const session = useSession();
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarkedCountries = async () => {
      try {
        setIsLoading(true);

        // Only fetch if we have bookmarks
        if (session.bookmarkedCountries.length === 0) {
          setCountries([]);
          setIsLoading(false);
          return;
        }

        const response = await fetch("https://restcountries.com/v3.1/all");

        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }

        const allCountries = await response.json();

        // Filter for only bookmarked countries
        const bookmarkedDetails = session.bookmarkedCountries
          .map((bookmark) => {
            return allCountries.find(
              (country) => country.cca3 === bookmark.cca3
            );
          })
          .filter((country) => country !== undefined);

        setCountries(bookmarkedDetails);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchBookmarkedCountries();
  }, [session.bookmarkedCountries]);

  // Remove a bookmark
  const removeBookmark = (e, country) => {
    e.stopPropagation();
    session.removeBookmark(country.cca3);
  };

  // Navigate to country details
  const handleCountryClick = (country) => {
    session.addVisitedCountry(country);
    navigate(`/country/${country.cca3}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Flag Finder</span>
          </div>

          <div>{/* Empty div for proper spacing */}</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-6">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <Star className="w-6 h-6 text-yellow-500 mr-2" />
          Your Bookmarked Countries
        </h1>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading bookmarks...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : countries.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-gray-600 mb-2">
              No bookmarks yet
            </h2>
            <p className="text-gray-500 mb-6">
              You haven't bookmarked any countries yet. Star your favorite
              countries to add them here.
            </p>
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-md shadow-md transition"
              onClick={() => navigate("/")}
            >
              Explore Countries
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((country) => (
              <div
                key={country.cca3}
                className="bg-white rounded-lg shadow-md overflow-hidden relative cursor-pointer"
                onClick={() => handleCountryClick(country)}
              >
                {/* Remove bookmark button */}
                <button
                  className="absolute right-3 top-3 z-10 p-1 rounded-full bg-white bg-opacity-80 shadow-sm"
                  onClick={(e) => removeBookmark(e, country)}
                >
                  <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCountryClick(country);
                    }}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
