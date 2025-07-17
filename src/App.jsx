import { useState, useEffect } from "react";
import "./App.css";
import { countries, languages, translations } from "./data/countries";
import CountrySelector from "./components/CountrySelector";
import CountryInfo from "./components/CountryInfo";
import LanguageSelector from "./components/LanguageSelector";

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  // Set document direction for RTL languages
  useEffect(() => {
    if (currentLanguage === "fa") {
      document.body.dir = "rtl";
      document.body.className = "persian-text";
    } else if (currentLanguage === "de") {
      document.body.dir = "ltr";
      document.body.className = "german-text";
    } else {
      document.body.dir = "ltr";
      document.body.className = "english-text";
    }
  }, [currentLanguage]);

  return (
    <div className={`app ${currentLanguage === "fa" ? "rtl" : "ltr"}`}>
      <header className="app-header">
        <h1>{translations.countryInfo[currentLanguage]}</h1>
        <LanguageSelector
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
        />
      </header>

      <main className="app-main">
        <CountrySelector
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
          currentLanguage={currentLanguage}
        />

        {selectedCountry && (
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
