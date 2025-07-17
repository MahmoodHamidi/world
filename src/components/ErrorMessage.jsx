function ErrorMessage({ error, currentLanguage, onRetry }) {
  const errorMessages = {
    en: {
      title: 'Error Loading Countries',
      message: 'Failed to load country data. Please check your internet connection.',
      retry: 'Try Again'
    },
    de: {
      title: 'Fehler beim Laden der Länder',
      message: 'Fehler beim Laden der Länderdaten. Bitte überprüfen Sie Ihre Internetverbindung.',
      retry: 'Erneut versuchen'
    },
    fa: {
      title: 'خطا در بارگذاری کشورها',
      message: 'خطا در بارگذاری اطلاعات کشورها. لطفاً اتصال اینترنت خود را بررسی کنید.',
      retry: 'تلاش مجدد'
    }
  };

  const messages = errorMessages[currentLanguage];

  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <h3 className="error-title">{messages.title}</h3>
        <p className="error-message">{messages.message}</p>
        <button className="retry-button" onClick={onRetry}>
          {messages.retry}
        </button>
      </div>
    </div>
  );
}

export default ErrorMessage;
