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
      console.log("Fetching countries from API...");
      const response = await fetch(
        `${API_BASE_URL}/all?fields=name,capital,population,area,currencies,languages,flags,cca2,cca3,region,subregion`
      );
      
      console.log("API Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response sample:", data[0]); // Debug log
      const processedData = this.processCountriesData(data);

      cache.set(cacheKey, processedData);
      return processedData;
    } catch (error) {
      console.error("Error fetching countries:", error);
      console.error("Error details:", error.message);
      
      // Fallback: try without fields parameter
      try {
        console.log("Trying fallback API call without fields...");
        const fallbackResponse = await fetch(`${API_BASE_URL}/all`);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log("Fallback API successful, processing data...");
          const processedData = this.processCountriesData(fallbackData);
          cache.set(cacheKey, processedData);
          return processedData;
        }
      } catch (fallbackError) {
        console.error("Fallback API also failed:", fallbackError);
      }
      
      throw error;
    }
  }, // Process API data to match our application format
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

      // Get flag with multiple fallback options
      const flag = this.getCountryFlag(country);

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

  // Get country flag with comprehensive fallback system
  getCountryFlag(country) {
    // Try emoji flag first
    if (country.flags?.emoji) {
      return country.flags.emoji;
    }

    // Try flag URL and convert to img tag
    if (country.flags?.png || country.flags?.svg) {
      const flagUrl = country.flags.png || country.flags.svg;
      return `<img src="${flagUrl}" alt="${country.name.common} flag" class="flag-img" />`;
    }

    // Fallback to country code based emoji flags
    const countryCodeFlags = {
      AF: "🇦🇫",
      AL: "🇦🇱",
      DZ: "🇩🇿",
      AS: "🇦🇸",
      AD: "🇦🇩",
      AO: "🇦🇴",
      AI: "🇦🇮",
      AQ: "🇦🇶",
      AG: "🇦🇬",
      AR: "🇦🇷",
      AM: "🇦🇲",
      AW: "🇦🇼",
      AU: "🇦🇺",
      AT: "🇦🇹",
      AZ: "🇦🇿",
      BS: "🇧🇸",
      BH: "🇧🇭",
      BD: "🇧🇩",
      BB: "🇧🇧",
      BY: "🇧🇾",
      BE: "🇧🇪",
      BZ: "🇧🇿",
      BJ: "🇧🇯",
      BM: "🇧🇲",
      BT: "🇧🇹",
      BO: "🇧🇴",
      BA: "🇧🇦",
      BW: "🇧🇼",
      BV: "🇧🇻",
      BR: "🇧🇷",
      IO: "🇮🇴",
      BN: "🇧🇳",
      BG: "🇧🇬",
      BF: "🇧🇫",
      BI: "🇧🇮",
      KH: "🇰🇭",
      CM: "🇨🇲",
      CA: "🇨🇦",
      CV: "🇨🇻",
      KY: "🇰🇾",
      CF: "🇨🇫",
      TD: "🇹🇩",
      CL: "🇨🇱",
      CN: "🇨🇳",
      CX: "🇨🇽",
      CC: "🇨🇨",
      CO: "🇨🇴",
      KM: "🇰🇲",
      CG: "🇨🇬",
      CD: "🇨🇩",
      CK: "🇨🇰",
      CR: "🇨🇷",
      CI: "🇨🇮",
      HR: "🇭🇷",
      CU: "🇨🇺",
      CY: "🇨🇾",
      CZ: "🇨🇿",
      DK: "🇩🇰",
      DJ: "🇩🇯",
      DM: "🇩🇲",
      DO: "🇩🇴",
      EC: "🇪🇨",
      EG: "🇪🇬",
      SV: "🇸🇻",
      GQ: "🇬🇶",
      ER: "🇪🇷",
      EE: "🇪🇪",
      ET: "🇪🇹",
      FK: "🇫🇰",
      FO: "🇫🇴",
      FJ: "🇫🇯",
      FI: "🇫🇮",
      FR: "🇫🇷",
      GF: "🇬🇫",
      PF: "🇵🇫",
      TF: "🇹🇫",
      GA: "🇬🇦",
      GM: "🇬🇲",
      GE: "🇬🇪",
      DE: "🇩🇪",
      GH: "🇬🇭",
      GI: "🇬🇮",
      GR: "🇬🇷",
      GL: "🇬🇱",
      GD: "🇬🇩",
      GP: "🇬🇵",
      GU: "🇬🇺",
      GT: "🇬🇹",
      GG: "🇬🇬",
      GN: "🇬🇳",
      GW: "🇬🇼",
      GY: "🇬🇾",
      HT: "🇭🇹",
      HM: "🇭🇲",
      VA: "🇻🇦",
      HN: "🇭🇳",
      HK: "🇭🇰",
      HU: "🇭🇺",
      IS: "🇮🇸",
      IN: "🇮🇳",
      ID: "🇮🇩",
      IR: "🇮🇷",
      IQ: "🇮🇶",
      IE: "🇮🇪",
      IM: "🇮🇲",
      IL: "🇮🇱",
      IT: "🇮🇹",
      JM: "🇯🇲",
      JP: "🇯🇵",
      JE: "🇯🇪",
      JO: "🇯🇴",
      KZ: "🇰🇿",
      KE: "🇰🇪",
      KI: "🇰🇮",
      KP: "🇰🇵",
      KR: "🇰🇷",
      KW: "🇰🇼",
      KG: "🇰🇬",
      LA: "🇱🇦",
      LV: "🇱🇻",
      LB: "🇱🇧",
      LS: "🇱🇸",
      LR: "🇱🇷",
      LY: "🇱🇾",
      LI: "🇱🇮",
      LT: "🇱🇹",
      LU: "🇱🇺",
      MO: "🇲🇴",
      MG: "🇲🇬",
      MW: "🇲🇼",
      MY: "🇲🇾",
      MV: "🇲🇻",
      ML: "🇲🇱",
      MT: "🇲🇹",
      MH: "🇲🇭",
      MQ: "🇲🇶",
      MR: "🇲🇷",
      MU: "🇲🇺",
      YT: "🇾🇹",
      MX: "🇲🇽",
      FM: "🇫🇲",
      MD: "🇲🇩",
      MC: "🇲🇨",
      MN: "🇲🇳",
      ME: "🇲🇪",
      MS: "🇲🇸",
      MA: "🇲🇦",
      MZ: "🇲🇿",
      MM: "🇲🇲",
      NA: "🇳🇦",
      NR: "🇳🇷",
      NP: "🇳🇵",
      NL: "🇳🇱",
      NC: "🇳🇨",
      NZ: "🇳🇿",
      NI: "🇳🇮",
      NE: "🇳🇪",
      NG: "🇳🇬",
      NU: "🇳🇺",
      NF: "🇳🇫",
      MK: "🇲🇰",
      MP: "🇲🇵",
      NO: "🇳🇴",
      OM: "🇴🇲",
      PK: "🇵🇰",
      PW: "🇵🇼",
      PS: "🇵🇸",
      PA: "🇵🇦",
      PG: "🇵🇬",
      PY: "🇵🇾",
      PE: "🇵🇪",
      PH: "🇵🇭",
      PN: "🇵🇳",
      PL: "🇵🇱",
      PT: "🇵🇹",
      PR: "🇵🇷",
      QA: "🇶🇦",
      RE: "🇷🇪",
      RO: "🇷🇴",
      RU: "🇷🇺",
      RW: "🇷🇼",
      BL: "🇧🇱",
      SH: "🇸🇭",
      KN: "🇰🇳",
      LC: "🇱🇨",
      MF: "🇲🇫",
      PM: "🇵🇲",
      VC: "🇻🇨",
      WS: "🇼🇸",
      SM: "🇸🇲",
      ST: "🇸🇹",
      SA: "🇸🇦",
      SN: "🇸🇳",
      RS: "🇷🇸",
      SC: "🇸🇨",
      SL: "🇸🇱",
      SG: "🇸🇬",
      SX: "🇸🇽",
      SK: "🇸🇰",
      SI: "🇸🇮",
      SB: "🇸🇧",
      SO: "🇸🇴",
      ZA: "🇿🇦",
      GS: "🇬🇸",
      SS: "🇸🇸",
      ES: "🇪🇸",
      LK: "🇱🇰",
      SD: "🇸🇩",
      SR: "🇸🇷",
      SJ: "🇸🇯",
      SZ: "🇸🇿",
      SE: "🇸🇪",
      CH: "🇨🇭",
      SY: "🇸🇾",
      TW: "🇹🇼",
      TJ: "🇹🇯",
      TZ: "🇹🇿",
      TH: "🇹🇭",
      TL: "🇹🇱",
      TG: "🇹🇬",
      TK: "🇹🇰",
      TO: "🇹🇴",
      TT: "🇹🇹",
      TN: "🇹🇳",
      TR: "🇹🇷",
      TM: "🇹🇲",
      TC: "🇹🇨",
      TV: "🇹🇻",
      UG: "🇺🇬",
      UA: "🇺🇦",
      AE: "🇦🇪",
      GB: "🇬🇧",
      US: "🇺🇸",
      UM: "🇺🇲",
      UY: "🇺🇾",
      UZ: "🇺🇿",
      VU: "🇻🇺",
      VE: "🇻🇪",
      VN: "🇻🇳",
      VG: "🇻🇬",
      VI: "🇻🇮",
      WF: "🇼🇫",
      EH: "🇪🇭",
      YE: "🇾🇪",
      ZM: "🇿🇲",
      ZW: "🇿🇼",
    };

    // Try to get flag by country code
    const countryCode = country.cca2 || country.cca3;
    if (countryCode && countryCodeFlags[countryCode]) {
      return countryCodeFlags[countryCode];
    }

    // Final fallback
    return "🏴";
  },
};
