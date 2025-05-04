// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SessionProvider } from "./Pages/SessionManager"; // Import the SessionProvider
import FlagFinderLandingPage from "./Pages/Homepage";
import CountryDetailPage from "./Pages/Detail";
import SearchPage from "./Pages/Region";
import BookmarkPage from "./Pages/Bookmark";
import HistoryPage from "./Pages/History";

function App() {
  return (
    <SessionProvider>
      {" "}
      {/* Wrap your entire app with SessionProvider */}
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<FlagFinderLandingPage />} />
            <Route
              path="/country/:countryCode"
              element={<CountryDetailPage />}
            />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/bookmarks" element={<BookmarkPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </div>
      </Router>
    </SessionProvider>
  );
}

export default App;
