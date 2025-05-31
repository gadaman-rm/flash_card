export interface LanguageCode {
  name: string;
  code: string;
  nativeName: string;
}

export const languageCodes: LanguageCode[] = [
    { name: "English", code: "en", nativeName: "English" },
    { name: "Arabic", code: "ar", nativeName: "العربية" },
    { name: "Chinese", code: "zh", nativeName: "中文" },
    { name: "French", code: "fr", nativeName: "Français" },
    { name: "German", code: "de", nativeName: "Deutsch" },
    { name: "Italian", code: "it", nativeName: "Italiano" },
    { name: "Japanese", code: "ja", nativeName: "日本語" },
    { name: "Korean", code: "ko", nativeName: "한국어" },
    { name: "Persian", code: "fa", nativeName: "فارسی" },
  // Add more languages as needed
]; 