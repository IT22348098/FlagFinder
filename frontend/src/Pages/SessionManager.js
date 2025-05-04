// SessionManager.js
import { useState, useEffect, createContext, useContext } from "react";

// Define our Session Context
const SessionContext = createContext(null);

// Initial session state
const initialState = {
  bookmarkedCountries: [],
  visitedCountries: [],
  recentSearches: [],
  preferences: {
    darkMode: false,
    displayCurrency: "USD",
    language: "en",
    showPopulation: true,
    showCapital: true,
    showCurrency: true,
    showLanguages: true,
  },
  lastVisit: new Date().toISOString(),
};

// Session provider component
export const SessionProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState(() => {
    // Try to load session from localStorage on initial render
    try {
      const savedSession = localStorage.getItem("flagFinderSession");
      return savedSession ? JSON.parse(savedSession) : initialState;
    } catch (error) {
      console.error("Failed to load session from localStorage:", error);
      return initialState;
    }
  });

  // Save to localStorage whenever session data changes
  useEffect(() => {
    try {
      localStorage.setItem("flagFinderSession", JSON.stringify(sessionData));
    } catch (error) {
      console.error("Failed to save session to localStorage:", error);
    }
  }, [sessionData]);

  // Session expiry check
  useEffect(() => {
    const checkSessionValidity = () => {
      try {
        const savedSession = localStorage.getItem("flagFinderSession");
        if (savedSession) {
          const parsedSession = JSON.parse(savedSession);
          const lastVisit = new Date(parsedSession.lastVisit);
          const now = new Date();

          // Check if session is older than 24 hours
          if (now - lastVisit > 24 * 60 * 60 * 1000) {
            // Reset session if expired
            setSessionData(initialState);
          } else {
            // Update last visit time
            setSessionData((prev) => ({
              ...prev,
              lastVisit: now.toISOString(),
            }));
          }
        }
      } catch (error) {
        console.error("Error checking session validity:", error);
      }
    };

    checkSessionValidity();

    // Also check when tab becomes active again
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSessionValidity();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Utility functions for modifying session data
  const bookmarkCountry = (country) => {
    setSessionData((prev) => {
      // Check if already bookmarked to avoid duplicates
      if (prev.bookmarkedCountries.some((c) => c.cca3 === country.cca3)) {
        return prev;
      }

      // Add to bookmarks with timestamp
      return {
        ...prev,
        bookmarkedCountries: [
          ...prev.bookmarkedCountries,
          {
            cca3: country.cca3,
            name: country.name.common,
            flag: country.flag||country.flags.svg || country.flags.png,
            timestamp: new Date().toISOString(),
          },
        ],
      };
    });
  };

  const removeBookmark = (countryCode) => {
    setSessionData((prev) => ({
      ...prev,
      bookmarkedCountries: prev.bookmarkedCountries.filter(
        (c) => c.cca3 !== countryCode
      ),
    }));
  };

  const addVisitedCountry = (country) => {
    setSessionData((prev) => {
      // Remove if already in history (to move it to the front)
      const filteredHistory = prev.visitedCountries.filter(
        (c) => c.cca3 !== country.cca3
      );

      // Add to front of history with timestamp
      return {
        ...prev,
        visitedCountries: [
          {
            cca3: country.cca3,
            name: country.name.common,
            flag: country.flag || country.flags.svg || country.flags.png,
            timestamp: new Date().toISOString(),
          },
          ...filteredHistory,
        ].slice(0, 10), // Keep only 10 most recent
      };
    });
  };

  const addSearchTerm = (term) => {
    if (!term.trim()) return; // Don't add empty searches

    setSessionData((prev) => {
      // Remove if already in history (to move it to the front)
      const filteredSearches = prev.recentSearches.filter(
        (s) => s.term.toLowerCase() !== term.toLowerCase()
      );

      // Add to front of history with timestamp
      return {
        ...prev,
        recentSearches: [
          {
            term: term,
            timestamp: new Date().toISOString(),
          },
          ...filteredSearches,
        ].slice(0, 5), // Keep only 5 most recent
      };
    });
  };

  const clearSearchHistory = () => {
    setSessionData((prev) => ({
      ...prev,
      recentSearches: [],
    }));
  };

  const updatePreference = (key, value) => {
    setSessionData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
  };

  const clearSession = () => {
    setSessionData(initialState);
  };

  // Expose session data and utility functions through context
  const sessionManager = {
    ...sessionData,
    bookmarkCountry,
    removeBookmark,
    addVisitedCountry,
    addSearchTerm,
    clearSearchHistory,
    updatePreference,
    clearSession,
    isBookmarked: (countryCode) =>
      sessionData.bookmarkedCountries.some((c) => c.cca3 === countryCode),
  };

  return (
    <SessionContext.Provider value={sessionManager}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook for using the session
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
