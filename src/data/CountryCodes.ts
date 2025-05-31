export interface CountryCode {
  name: string;
  dial_code: string;
  code: string;
  enName: string;
  languageCode: string;
}

export const countryCodes: CountryCode[] = [
  { name: "الإمارات العربية المتحدة", enName: "United Arab Emirates", dial_code: "+971", code: "AE", languageCode: "ar" },
  { name: "البحرين", enName: "Bahrain", dial_code: "+973", code: "BH", languageCode: "ar" },
  { name: "Brasil", enName: "Brazil", dial_code: "+55", code: "BR", languageCode: "pt" },
  { name: "Canada", enName: "Canada", dial_code: "+1", code: "CA", languageCode: "en" },
  { name: "中国", enName: "China", dial_code: "+86", code: "CN", languageCode: "zh" },
  { name: "Deutschland", enName: "Germany", dial_code: "+49", code: "DE", languageCode: "de" },
  { name: "France", enName: "France", dial_code: "+33", code: "FR", languageCode: "fr" },
  { name: "United Kingdom", enName: "United Kingdom", dial_code: "+44", code: "GB", languageCode: "en" },
  { name: "भारत", enName: "India", dial_code: "+91", code: "IN", languageCode: "hi" },
  { name: "العراق", enName: "Iraq", dial_code: "+964", code: "IQ", languageCode: "ar" },
  { name: "ایران", enName: "Iran", dial_code: "+98", code: "IR", languageCode: "fa" },
  { name: "Italia", enName: "Italy", dial_code: "+39", code: "IT", languageCode: "it" },
  { name: "الأردن", enName: "Jordan", dial_code: "+962", code: "JO", languageCode: "ar" },
  { name: "日本", enName: "Japan", dial_code: "+81", code: "JP", languageCode: "ja" },
  { name: "الكويت", enName: "Kuwait", dial_code: "+965", code: "KW", languageCode: "ar" },
  { name: "لبنان", enName: "Lebanon", dial_code: "+961", code: "LB", languageCode: "ar" },
  { name: "عمان", enName: "Oman", dial_code: "+968", code: "OM", languageCode: "ar" },
  { name: "فلسطين", enName: "Palestine", dial_code: "+970", code: "PS", languageCode: "ar" },
  { name: "قطر", enName: "Qatar", dial_code: "+974", code: "QA", languageCode: "ar" },
  { name: "السعودية", enName: "Saudi Arabia", dial_code: "+966", code: "SA", languageCode: "ar" },
  { name: "سوريا", enName: "Syria", dial_code: "+963", code: "SY", languageCode: "ar" },
  { name: "United States", enName: "United States", dial_code: "+1", code: "US", languageCode: "en" },
  { name: "اليمن", enName: "Yemen", dial_code: "+967", code: "YE", languageCode: "ar" },
];
