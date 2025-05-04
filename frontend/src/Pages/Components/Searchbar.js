import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function CountrySearch({ onCountrySelect }) {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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

  // Handle country selection
  const handleCountryClick = (country) => {
    if (onCountrySelect) {
      // If a callback function is provided, use it
      onCountrySelect(country);
    } else {
      // Default behavior: navigate to the country detail page
      navigate(`/country/${country.cca3}`);
    }
    
    // Clear the search term after selection
    setSearchTerm("");
  };

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a country..."
          className="w-full border border-gray-300 rounded-md px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
      </div>

      {searchTerm && (
        <div className="mt-4 max-h-64 overflow-y-auto bg-white shadow-md rounded-md">
          {isLoading ? (
            <p className="text-center text-gray-500 py-4">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-4">{error}</p>
          ) : filteredCountries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
              {filteredCountries.slice(0, 6).map((country) => (
                <div
                  key={country.cca3}
                  className="border border-gray-200 rounded-md p-3 flex items-center space-x-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCountryClick(country)}
                >
                  {country.flags && (
                    <img
                      src={country.flags.svg || country.flags.png}
                      alt={`Flag of ${country.name.common}`}
                      className="w-10 h-6 object-cover rounded shadow-sm"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{country.name.common}</h3>
                    <p className="text-xs text-gray-500">{country.region}</p>
                  </div>
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
  );
}