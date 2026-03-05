import { useTranslation } from 'react-i18next';

const LANGS = ['fr', 'en', 'ro'] as const;

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  return (
    <div className={`flex gap-1 ${className}`} role="group" aria-label="Language selector">
      {LANGS.map((lng) => (
        <button
          key={lng}
          onClick={() => i18n.changeLanguage(lng)}
          aria-current={i18n.language === lng ? 'true' : undefined}
          className={`rounded px-2 py-1 text-xs font-semibold uppercase transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
            i18n.language === lng
              ? 'bg-primary text-bg-base'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {lng}
        </button>
      ))}
    </div>
  );
}
