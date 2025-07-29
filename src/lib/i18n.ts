// src/lib/i18n.ts
import zh from './locales/zh';
import en from './locales/en';

export type Lang = 'zh' | 'en';

const resources = { zh, en };

export function getDefaultLang(): Lang {
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language;
    if (lang.startsWith('zh')) return 'zh';
  }
  return 'en';
}

export function t(lang: Lang, key: string): string {
  return resources[lang]?.[key] || key;
}
