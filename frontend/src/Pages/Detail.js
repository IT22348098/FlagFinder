import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Globe, ArrowLeft, ExternalLink, Map } from "lucide-react";
import Footer from "./Components/Footer"; // Import the Footer component

export default function CountryDetailPage() {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://restcountries.com/v3.1/alpha/${countryCode}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch country details");
        }

        const data = await response.json();
        setCountry(data[0]);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    if (countryCode) {
      fetchCountryDetails();
    }
  }, [countryCode]);

  const handleBack = () => {
    navigate(-1);
  };

  // Helper function to format object data
  const formatObjectValues = (obj) => {
    if (!obj) return "N/A";
    return Object.values(obj).join(", ");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Loading country details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || "Country not found"}</p>
            <button
              onClick={handleBack}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Flag Finder</span>
          </div>

          <nav className="hidden md:flex space-x-6">
            <a href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </a>
            <a href="/search" className="text-gray-600 hover:text-gray-900">
              Search
            </a>
            <a href="/regions" className="text-gray-600 hover:text-gray-900">
              Regions
            </a>
          </nav>
        </div>
      </header>

      {/* Country Details Content */}
      <main className="flex-grow py-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="flex items-center text-indigo-600 hover:text-indigo-800 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to search
          </button>

          {/* Country Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center mb-12 gap-8">
            <div className="w-full md:w-1/3">
              {country.flags && (
                <img
                  src={country.flags.svg || country.flags.png}
                  alt={`Flag of ${country.name.common}`}
                  className="w-full rounded-lg shadow-md"
                />
              )}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {country.name.common}
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                {country.name.official}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                  {country.region}
                </span>
                {country.subregion && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {country.subregion}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Country Info Sections */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4">Basic Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-sm">Capital</p>
                  <p className="font-medium">
                    {country.capital ? country.capital.join(", ") : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Population</p>
                  <p className="font-medium">
                    {country.population.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Area</p>
                  <p className="font-medium">
                    {country.area
                      ? `${country.area.toLocaleString()} km²`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Languages</p>
                  <p className="font-medium">
                    {country.languages
                      ? formatObjectValues(country.languages)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Currencies</p>
                  <p className="font-medium">
                    {country.currencies
                      ? Object.values(country.currencies)
                          .map((curr) => `${curr.name} (${curr.symbol || ""})`)
                          .join(", ")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Geography & More */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4">Geography & More</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-sm">Continent</p>
                  <p className="font-medium">
                    {country.continents ? country.continents.join(", ") : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Timezone</p>
                  <p className="font-medium">
                    {country.timezones ? country.timezones.join(", ") : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Borders</p>
                  <p className="font-medium">
                    {country.borders && country.borders.length > 0
                      ? country.borders.join(", ")
                      : "Island/No land borders"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Driving Side</p>
                  <p className="font-medium capitalize">
                    {country.car?.side || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">UN Member</p>
                  <p className="font-medium">
                    {country.unMember ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Maps Section */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Map className="w-5 h-5 mr-2 text-indigo-500" />
              View on Maps
            </h2>
            <div className="flex flex-wrap gap-4">
              {country.maps?.googleMaps && (
                <a
                  href={country.maps.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md transition"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Google Maps
                </a>
              )}
              {country.maps?.openStreetMaps && (
                <a
                  href={country.maps.openStreetMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md transition"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  OpenStreetMap
                </a>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Using the imported Footer component */}
      <Footer />
    </div>
  );
}
