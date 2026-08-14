// Maps a visitor's detected country to a Google Translate language code.
// Pakistan and India are intentionally absent — the site is written for
// them already and should never be auto-translated. Everywhere else maps
// to that country's main language; unmapped/unknown countries fall back
// to no translation (the site is already in English).
export const COUNTRY_TO_LANGUAGE: Record<string, string> = {
  // Arabic
  "United Arab Emirates": "ar",
  "Saudi Arabia": "ar",
  Qatar: "ar",
  Kuwait: "ar",
  Bahrain: "ar",
  Oman: "ar",
  Egypt: "ar",
  Jordan: "ar",
  Iraq: "ar",
  Lebanon: "ar",
  Algeria: "ar",
  Morocco: "ar",
  Tunisia: "ar",
  Libya: "ar",
  Yemen: "ar",
  Sudan: "ar",

  // French
  France: "fr",
  Belgium: "fr",
  Switzerland: "fr",
  "Ivory Coast": "fr",
  Senegal: "fr",
  Cameroon: "fr",
  "Democratic Republic of the Congo": "fr",
  Mali: "fr",
  "Burkina Faso": "fr",
  Niger: "fr",
  Madagascar: "fr",
  Luxembourg: "fr",

  // Spanish
  Spain: "es",
  Mexico: "es",
  Argentina: "es",
  Colombia: "es",
  Chile: "es",
  Peru: "es",
  Venezuela: "es",
  Ecuador: "es",
  Guatemala: "es",
  Cuba: "es",
  "Dominican Republic": "es",
  Bolivia: "es",
  Honduras: "es",
  Paraguay: "es",
  "El Salvador": "es",
  Nicaragua: "es",
  "Costa Rica": "es",
  Panama: "es",
  Uruguay: "es",

  // Portuguese
  Portugal: "pt",
  Brazil: "pt",
  Angola: "pt",
  Mozambique: "pt",

  // German
  Germany: "de",
  Austria: "de",

  // Italian
  Italy: "it",

  // Russian
  Russia: "ru",
  Belarus: "ru",
  Kazakhstan: "ru",

  // Turkish
  Turkey: "tr",

  // Chinese
  China: "zh-CN",
  Taiwan: "zh-TW",
  "Hong Kong": "zh-TW",

  // Japanese / Korean
  Japan: "ja",
  "South Korea": "ko",

  // Southeast/South Asian
  Indonesia: "id",
  Malaysia: "ms",
  Thailand: "th",
  Vietnam: "vi",
  Philippines: "tl",
  Bangladesh: "bn",
  "Sri Lanka": "si",
  Nepal: "ne",

  // European
  Netherlands: "nl",
  Poland: "pl",
  Sweden: "sv",
  Norway: "no",
  Denmark: "da",
  Finland: "fi",
  Greece: "el",
  "Czech Republic": "cs",
  Hungary: "hu",
  Romania: "ro",
  Ukraine: "uk",
  Bulgaria: "bg",
  Croatia: "hr",
  Serbia: "sr",
  Slovakia: "sk",
  Slovenia: "sl",
  Israel: "iw",

  // English-speaking (no translation needed, listed for clarity/self-doc)
  "United States": "en",
  "United Kingdom": "en",
  Canada: "en",
  Australia: "en",
  "New Zealand": "en",
  Ireland: "en",
  "South Africa": "en",
};

export function languageForCountry(country: string): string | null {
  if (!country || country === "Pakistan" || country === "India" || country === "Unknown") {
    return null;
  }
  const lang = COUNTRY_TO_LANGUAGE[country];
  if (!lang || lang === "en") return null; // already English, nothing to do
  return lang;
}
