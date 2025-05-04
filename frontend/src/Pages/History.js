import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Clock, ArrowLeft, Star, Search, Trash2 } from "lucide-react";
import { useSession } from "./SessionManager";

export default function HistoryPage() {
  const navigate = useNavigate();
  const session = useSession();
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisitedCountries = async () => {
      try {
        setIsLoading(true);
        
        // Only fetch if we have visited countries
        if (session.visitedCountries.length === 0) {
          setCountries([]);
          setIsLoading(false);
          return;
        }
        
        const response = await fetch("https://restcountries.com/v3.1/all");
        
        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }
        
        const allCountries = await response.json();
        
        // Match visited countries with full country data
        // We'll use the stored visit data but enrich it with the full country info
        const visitedWithFullData = session.visitedCountries.map(visited => {
          const fullCountry = allCountries.find(c => c.cca3 === visited.cca3);
          return {
            ...visited,
            fullData: fullCountry
          };
        });
          
        setCountries(visitedWithFullData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchVisitedCountries();
  }, [session.visitedCountries]);
  
  // Navigate to country details
  const handleCountryClick = (visited) => {
    // Add another visit if we have the full country data
    if (visited.fullData) {
      session.addVisitedCountry(visited.fullData);
    }
    navigate(`/country/${visited.cca3}`);
  };
  
  // Format date for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Toggle bookmark status
  const toggleBookmark = (e, country) => {
    e.stopPropagation();
    
    if (session.isBookmarked(country.cca3)) {
      session.removeBookmark(country.cca3);
    } else if (country.fullData) {
      session.bookmarkCountry(country.fullData);
    }
  };
  
  // Group countries by visit date (just the date part, not time)
  const groupByDate = (visits) => {
    const groups = {};
    
    visits.forEach(visit => {
      const date = new Date(visit.timestamp);
      const dateKey = date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(visit);
    });
    
    // Convert to array sorted by date (newest first)
    return Object.entries(groups)
      .map(([date, visits]) => ({ date, visits }))
      .sort((a, b) => {
        const dateA = new Date(a.visits[0].timestamp);
        const dateB = new Date(b.visits[0].timestamp);
        return dateB - dateA;
      });
  };
  
  const groupedVisits = groupByDate(countries);
  
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
          
          <div>
            {/* Clear history button */}
            {session.visitedCountries.length > 0 && (
              <button 
                className="text-red-500 hover:text-red-700 flex items-center space-x-1 text-sm"
                onClick={session.clearVisitHistory}
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear History</span>
              </button>
            )}
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto py-8 px-6">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <Clock className="w-6 h-6 text-indigo-500 mr-2" />
          Your Browsing History
        </h1>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading history...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : countries.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-gray-600 mb-2">No history yet</h2>
            <p className="text-gray-500 mb-6">
              You haven't visited any countries yet. Start exploring to see your history here.
            </p>
            <button 
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-md shadow-md transition"
              onClick={() => navigate("/")}
            >
              Start Exploring
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedVisits.map(group => (
              <div key={group.date} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-100 px-6 py-3 border-b">
                  <h2 className="font-medium text-gray-700">{group.date}</h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {group.visits.map((visited, index) => (
                    <div 
                      key={`${visited.cca3}-${index}`}
                      className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleCountryClick(visited)}
                    >
                      <div className="flex-shrink-0 w-16 h-12 mr-4">
                        <img 
                          src={visited.flag} 
                          alt={`Flag of ${visited.name}`}
                          className="w-full h-full object-cover rounded shadow-sm"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-medium">{visited.name}</h3>
                        <p className="text-xs text-gray-500">
                          {formatDate(visited.timestamp)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {/* Bookmark button */}
                        <button
                          className="text-gray-400 hover:text-yellow-500"
                          onClick={(e) => toggleBookmark(e, visited)}
                        >
                          {session.isBookmarked(visited.cca3) ? (
                            <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                          ) : (
                            <Star className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Search History Section if it exists */}
        {session.recentSearches.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Search className="w-5 h-5 text-indigo-500 mr-2" />
              Recent Searches
            </h2>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex justify-between items-center bg-gray-100 px-6 py-3 border-b">
                <h3 className="font-medium text-gray-700">Search Terms</h3>
                <button 
                  className="text-red-500 hover:text-red-700 text-sm flex items-center"
                  onClick={session.clearSearchHistory}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear
                </button>
              </div>
              
              <div className="divide-y divide-gray-100">
                {session.recentSearches.map((search, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      navigate("/?search=" + encodeURIComponent(search.term));
                    }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 mr-4 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Search className="w-4 h-4 text-indigo-500" />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-medium">{search.term}</h3>
                      <p className="text-xs text-gray-500">
                        {new Date(search.timestamp).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}