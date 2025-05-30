import cssVariables from "../../manager/view/CSSVariables";
import { EventCallback, EventEmitter } from "../../manager/lifecycle/EventEmitter";
import {languageCodes } from "../../data/LanguageCodes";

type LanguageServiceEvents = "languageChanged";

class LanguageService {
  private eventEmitter: EventEmitter<LanguageServiceEvents>;
  currentLanguage: string = "en"; // Using string instead of language type
  private translations: Record<string, string> = {};

  constructor() {
    this.eventEmitter = new EventEmitter<LanguageServiceEvents>();
  }

  private isValidLanguage(code: string): boolean {
    return languageCodes.some(lang => lang.code === code);
  }

  on(event: LanguageServiceEvents, callback: EventCallback) {
    return this.eventEmitter.on(event, callback);
  }

  async setLanguage(language: string): Promise<void> {
    try {
      if (!this.isValidLanguage(language)) {
        throw new Error(`Invalid language code: ${language}`);
      }

      this.currentLanguage = language;
      const address = `./locales/${language}.json`;

      const response = await fetch(address);
      if (!response.ok) {
        throw new Error("Language file not found");
      }
      this.translations = await response.json();

      // Set text direction and font family based on script
      switch (language) {
        case "ar":
        case "fa":
          document.documentElement.setAttribute("dir", "rtl");
          cssVariables.set("--font-family", "Rubik");
          break;
        case "zh":
        case "ja":
        case "ko":
          document.documentElement.setAttribute("dir", "ltr");
          cssVariables.set("--font-family", '"Noto Sans", "Arial", "sans-serif"');
          break;
        default:
          document.documentElement.setAttribute("dir", "ltr");
          cssVariables.set("--font-family", '"Roboto", "Arial", "sans-serif"');
      }

      this.eventEmitter.emit("languageChanged");
    } catch (error) {
      console.error("Failed to load language file:", error);
      // Fallback to default language
      this.currentLanguage = "en";
      const response = await fetch("./locales/en.json");
      this.translations = await response.json();
      this.eventEmitter.emit("languageChanged");
    }
  }

  tr(key: string, localsJson?: { [key: string]: { [key: string]: string } }): string {
    if (localsJson) {
      if (localsJson[this.currentLanguage]) return localsJson[this.currentLanguage][key];
      else return localsJson["en"][key];
    } else return this.translations[key] || key;
  }
}

const lan = new LanguageService();
export default lan;
