import { useTheme } from '../components/ThemeProvider';
import { translations, TranslationKey } from '../components/translations';

export function useTranslations() {
  const { language } = useTheme();

  const tr = (key: TranslationKey): string => {
    return translations[key]?.[language] || key;
  };

  const tCustom = (ar: string, en: string): string => {
    return language === 'ar' ? ar : en;
  };

  return { tr, t: tCustom, language };
}
