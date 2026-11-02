import { translations } from './complete';
import type { SupportedLanguage } from './complete';

interface ResolveLanguageOptions {
  configLang?: string;
  hassLang?: string;
}

const normalize = (lang?: string): SupportedLanguage | undefined => {
  if (!lang) return undefined;
  const lower = lang.trim().replaceAll("_", "-").toLowerCase();
  const exact = Object.keys(translations).find(key => key.toLowerCase() === lower);
  if (exact) return exact as SupportedLanguage;
  if (/^zh-(?:tw|hk|mo|hant)/.test(lower)) return "zh-Hant";
  if (/^zh(?:-|$)/.test(lower)) return "zh-Hans";
  if (/^pt(?:-|$)/.test(lower)) return /^pt-br(?:-|$)/.test(lower) ? "pt-BR" : "pt-PT";
  if (/^sr-latn(?:-|$)/.test(lower)) return "sr-Latn";
  if (/^ko(?:-|$)/.test(lower)) return "ko-KR";
  if (/^no(?:-|$)/.test(lower)) return "nb";
  const base = lower.split('-')[0];
  if (Object.hasOwn(translations, base)) return base as SupportedLanguage;
  return undefined;
};

export const resolveLanguage = ({ configLang, hassLang }: ResolveLanguageOptions = {}): SupportedLanguage => {
  if (configLang && configLang !== 'auto') return normalize(configLang) ?? 'en';

  return (
    normalize(hassLang) ??
    normalize(typeof navigator !== 'undefined' ? navigator.language : undefined) ??
    'en'
  );
};
