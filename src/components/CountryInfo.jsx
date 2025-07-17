import { translations } from "../data/countries";

function CountryInfo({ country, currentLanguage }) {
  if (!country) return null;

  return (
    <div className="country-info">
      <div className="country-header">
        <span className="country-flag">
          {country.flag && country.flag.startsWith("<img") ? (
            <span dangerouslySetInnerHTML={{ __html: country.flag }}></span>
          ) : (
            country.flag
          )}
        </span>
        <h2>{country.name[currentLanguage]}</h2>
      </div>

      <div className="country-details">
        <div className="info-grid">
          <div className="info-item">
            <strong>{translations.capital[currentLanguage]}:</strong>
            <span>{country.capital[currentLanguage]}</span>
          </div>

          <div className="info-item">
            <strong>{translations.population[currentLanguage]}:</strong>
            <span>{country.population}</span>
          </div>

          <div className="info-item">
            <strong>{translations.area[currentLanguage]}:</strong>
            <span>{country.area}</span>
          </div>

          <div className="info-item">
            <strong>{translations.currency[currentLanguage]}:</strong>
            <span>{country.currency}</span>
          </div>

          <div className="info-item">
            <strong>{translations.language[currentLanguage]}:</strong>
            <span>{country.language[currentLanguage]}</span>
          </div>
        </div>

        <div className="description">
          <h3>{translations.description[currentLanguage]}</h3>
          <p>{country.description[currentLanguage]}</p>
        </div>

        <div className="cities-section">
          <h3>{translations.majorCities[currentLanguage]}</h3>
          <div className="cities-grid">
            {country.cities.map((city, index) => (
              <div key={index} className="city-item">
                <span className="city-name">{city.name}</span>
                <span className="city-population">{city.population}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountryInfo;
