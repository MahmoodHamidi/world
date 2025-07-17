import React from "react";

const ThemeToggle = ({ isDarkMode, onToggle, currentLanguage }) => {
  const getToggleText = () => {
    switch (currentLanguage) {
      case "fa":
        return isDarkMode ? "حالت روشن" : "حالت تاریک";
      case "de":
        return isDarkMode ? "Hell Modus" : "Dunkel Modus";
      default:
        return isDarkMode ? "Light Mode" : "Dark Mode";
    }
  };

  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={getToggleText()}
    >
      <span className="theme-icon">{isDarkMode ? "☀️" : "🌙"}</span>
      <span className="theme-text">{getToggleText()}</span>
    </button>
  );
};

export default ThemeToggle;
