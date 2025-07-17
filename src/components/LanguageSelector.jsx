import { languages, translations } from "../data/countries";

function LanguageSelector({ currentLanguage, onLanguageChange }) {
  return (
    <div className="language-selector">
      <label htmlFor="language-select">
        {translations.selectLanguage[currentLanguage]}:
      </label>
      <select
        id="language-select"
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="language-select"
      >
        {Object.entries(languages).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;
