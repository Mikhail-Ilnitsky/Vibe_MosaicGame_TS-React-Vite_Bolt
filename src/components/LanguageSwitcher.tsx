import type { Language } from '@/types';

interface LanguageSwitcherProps {
  language: Language;
  onChange: (language: Language) => void;
}

export function LanguageSwitcher({ language, onChange }: LanguageSwitcherProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-stone-200 bg-white p-1 shadow-sm" aria-label="Language">
      <button
        type="button"
        aria-pressed={language === 'ru'}
        onClick={() => onChange('ru')}
        className={`min-w-11 rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.14em] transition-all duration-200 ${
          language === 'ru' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-400 hover:text-stone-700'
        }`}
      >
        RU
      </button>
      <button
        type="button"
        aria-pressed={language === 'en'}
        onClick={() => onChange('en')}
        className={`min-w-11 rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.14em] transition-all duration-200 ${
          language === 'en' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-400 hover:text-stone-700'
        }`}
      >
        EN
      </button>
    </div>
  );
}
