import { translations } from "../data/countries";

function CountrySelector({ selectedCountry, onCountryChange, currentLanguage, countries }) {
  return (
    <div className="country-selector">
      <label htmlFor="country-select">
        {translations.selectCountry[currentLanguage]}:
      </label>
      <select
        id="country-select"
        value={selectedCountry || ''}
        onChange={(e) => onCountryChange(e.target.value || null)}
        className="country-select"
      >
        <option value="">
          -- {translations.selectCountry[currentLanguage]} --
        </option>
        {Object.values(countries).map((country) => (
          <option key={country.id} value={country.id}>
            {country.flag} {country.name[currentLanguage]}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CountrySelector;
