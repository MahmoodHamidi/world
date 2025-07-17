import { useState, useEffect } from "react";
import "./App.css";
import { languages, translations } from "./data/countries";
import { countryService } from "./services/countryApi";
import CountrySelector from "./components/CountrySelector";
import CountryInfo from "./components/CountryInfo";
import LanguageSelector from "./components/LanguageSelector";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [countries, setCountries] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Set document direction for RTL languages and theme
  useEffect(() => {
    const themeClass = isDarkMode ? "dark-mode" : "light-mode";
    console.log(
      "Applying theme:",
      themeClass,
      "for language:",
      currentLanguage
    );

    if (currentLanguage === "fa") {
      document.body.dir = "rtl";
      document.body.className = `persian-text ${themeClass}`;
    } else if (currentLanguage === "de") {
      document.body.dir = "ltr";
      document.body.className = `german-text ${themeClass}`;
    } else {
      document.body.dir = "ltr";
      document.body.className = `english-text ${themeClass}`;
    }

    console.log("Body className:", document.body.className);
  }, [currentLanguage, isDarkMode]);

  // Load saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    console.log(
      "Toggling theme from",
      isDarkMode ? "dark" : "light",
      "to",
      newMode ? "dark" : "light"
    );
    setIsDarkMode(newMode);
  };

  // Fetch countries data from API
  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      const countriesData = await countryService.getAllCountries();
      setCountries(countriesData);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch countries:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  if (loading) {
    return (
      <div className="app">
        <LoadingSpinner currentLanguage={currentLanguage} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <ErrorMessage
          error={error}
          currentLanguage={currentLanguage}
          onRetry={fetchCountries}
        />
      </div>
    );
  }

  return (
    <div className={`app ${currentLanguage === "fa" ? "rtl" : "ltr"}`}>
      <header className="app-header">
        <h1>{translations.countryInfo[currentLanguage]}</h1>
        <div className="header-controls">
          <ThemeToggle
            isDarkMode={isDarkMode}
            onToggle={toggleTheme}
            currentLanguage={currentLanguage}
          />
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
          />
        </div>
      </header>

      <main className="app-main">
        <CountrySelector
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
          currentLanguage={currentLanguage}
          countries={countries}
        />

        {selectedCountry && countries[selectedCountry] && (
          <CountryInfo
            country={countries[selectedCountry]}
            currentLanguage={currentLanguage}
          />
        )}
      </main>
    </div>
  );
}

export default App;
