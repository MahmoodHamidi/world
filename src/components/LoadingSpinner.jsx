import { translations } from "../data/countries";

function LoadingSpinner({ currentLanguage }) {
  const loadingText = {
    en: 'Loading countries...',
    de: 'Länder werden geladen...',
    fa: 'در حال بارگذاری کشورها...'
  };

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">{loadingText[currentLanguage]}</p>
    </div>
  );
}

export default LoadingSpinner;
