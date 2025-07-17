// API service for fetching country data
const API_BASE_URL = "https://restcountries.com/v3.1";

// Cache for API responses to avoid repeated calls
const cache = new Map();

export const countryService = {
  // Fetch all countries
  async getAllCountries() {
    const cacheKey = "all-countries";

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/all?fields=name,capital,population,area,currencies,languages,flags,cca2,region,subregion`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch countries");
      }

      const data = await response.json();
      const processedData = this.processCountriesData(data);

      cache.set(cacheKey, processedData);
      return processedData;
    } catch (error) {
      console.error("Error fetching countries:", error);
      throw error;
    }
  },

  // Process API data to match our application format
  processCountriesData(apiData) {
    const countries = {};

    apiData.forEach((country) => {
      if (!country.name || !country.capital || !country.capital[0]) return;

      const countryId = country.name.common.toLowerCase().replace(/\s+/g, "");
      const countryName = country.name.common;
      const nativeName = country.name.nativeName
        ? Object.values(country.name.nativeName)[0]?.common || countryName
        : countryName;

      // Get currency info
      const currency = country.currencies
        ? Object.values(country.currencies)[0]
        : { name: "Unknown", symbol: "" };

      // Get language info
      const languages = country.languages
        ? Object.values(country.languages).join(", ")
        : "Unknown";

      // Get flag
      const flag = country.flags?.emoji || "🏴";

      countries[countryId] = {
        id: countryId,
        name: {
          en: countryName,
          de: this.getGermanName(countryName),
          fa: this.getPersianName(countryName),
        },
        flag: flag,
        capital: {
          en: country.capital[0],
          de: country.capital[0],
          fa: this.getPersianName(country.capital[0]),
        },
        population: this.formatPopulation(country.population),
        area: `${country.area?.toLocaleString() || "Unknown"} km²`,
        currency: `${currency.name} (${currency.symbol || "N/A"})`,
        language: {
          en: languages,
          de: languages,
          fa: languages,
        },
        description: {
          en: `${countryName} is located in ${country.region}${
            country.subregion ? `, ${country.subregion}` : ""
          }.`,
          de: `${countryName} befindet sich in ${country.region}${
            country.subregion ? `, ${country.subregion}` : ""
          }.`,
          fa: `${this.getPersianName(countryName)} در ${
            country.region
          } قرار دارد.`,
        },
        region: country.region,
        subregion: country.subregion,
        cities: this.generateMajorCities(countryName), // We'll generate some cities since API doesn't provide them
      };
    });

    return countries;
  },

  // Format population numbers
  formatPopulation(population) {
    if (!population) return "Unknown";

    if (population >= 1000000000) {
      return `${(population / 1000000000).toFixed(1)} billion`;
    } else if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)} million`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(0)}k`;
    }
    return population.toString();
  },

  // Generate some major cities (this is a simplified approach)
  generateMajorCities(countryName) {
    const cityData = {
      "United States": [
        { name: "New York", population: "8.3 million" },
        { name: "Los Angeles", population: "4.0 million" },
        { name: "Chicago", population: "2.7 million" },
      ],
      Germany: [
        { name: "Berlin", population: "3.7 million" },
        { name: "Hamburg", population: "1.9 million" },
        { name: "Munich", population: "1.5 million" },
      ],
      Iran: [
        { name: "Tehran", population: "9.1 million" },
        { name: "Mashhad", population: "3.3 million" },
        { name: "Isfahan", population: "2.2 million" },
      ],
      France: [
        { name: "Paris", population: "2.2 million" },
        { name: "Marseille", population: "873,000" },
        { name: "Lyon", population: "518,000" },
      ],
      Japan: [
        { name: "Tokyo", population: "14.0 million" },
        { name: "Yokohama", population: "3.8 million" },
        { name: "Osaka", population: "2.7 million" },
      ],
    };

    return (
      cityData[countryName] || [
        { name: "Major City 1", population: "N/A" },
        { name: "Major City 2", population: "N/A" },
      ]
    );
  },

  // Simple German name mapping (you can expand this)
  getGermanName(englishName) {
    const germanNames = {
      "United States": "Vereinigte Staaten",
      Germany: "Deutschland",
      France: "Frankreich",
      "United Kingdom": "Vereinigtes Königreich",
      Italy: "Italien",
      Spain: "Spanien",
      Russia: "Russland",
      China: "China",
      Japan: "Japan",
      India: "Indien",
      Brazil: "Brasilien",
      Canada: "Kanada",
      Australia: "Australien",
      Mexico: "Mexiko",
      Turkey: "Türkei",
      Egypt: "Ägypten",
      "South Africa": "Südafrika",
      Argentina: "Argentinien",
      "New Zealand": "Neuseeland",
      "South Korea": "Südkorea",
      Nigeria: "Nigeria",
    };

    return germanNames[englishName] || englishName;
  },

  // Simple Persian name mapping (you can expand this)
  getPersianName(englishName) {
    const persianNames = {
      "United States": "ایالات متحده",
      Germany: "آلمان",
      France: "فرانسه",
      "United Kingdom": "بریتانیا",
      Italy: "ایتالیا",
      Spain: "اسپانیا",
      Russia: "روسیه",
      China: "چین",
      Japan: "ژاپن",
      India: "هند",
      Brazil: "برزیل",
      Canada: "کانادا",
      Australia: "استرالیا",
      Mexico: "مکزیک",
      Turkey: "ترکیه",
      Iran: "ایران",
      Egypt: "مصر",
      "South Africa": "آفریقای جنوبی",
      Argentina: "آرژانتین",
      "New Zealand": "نیوزلند",
      "South Korea": "کره جنوبی",
      Nigeria: "نیجریه",
      Tehran: "تهران",
      Berlin: "برلین",
      Paris: "پاریس",
      London: "لندن",
      Rome: "رم",
      Madrid: "مادرید",
      Moscow: "مسکو",
      Beijing: "پکن",
      Tokyo: "توکیو",
      "New Delhi": "دهلی نو",
      Brasília: "برازیلیا",
      Ottawa: "اتاوا",
      Canberra: "کانبرا",
      "Mexico City": "مکزیکو سیتی",
      Ankara: "آنکارا",
      Cairo: "قاهره",
      "Cape Town": "کیپ تاون",
      "Buenos Aires": "بوئنوس آیرس",
      Wellington: "ولینگتون",
      Seoul: "سئول",
      Abuja: "آبوجا",
    };

    return persianNames[englishName] || englishName;
  },
};
