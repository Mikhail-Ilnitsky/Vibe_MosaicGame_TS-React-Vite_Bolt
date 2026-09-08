import { Grid2X2 } from 'lucide-react';
import type { Language, Screen } from '@/types';
import { t } from '@/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

interface AppHeaderProps {
  language: Language;
  screen: Screen;
  onLanguageChange: (language: Language) => void;
}

export function AppHeader({ language, screen, onLanguageChange }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-7 lg:px-12">
      <div className="flex items-center gap-2.5 text-stone-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-white">
          <Grid2X2 size={16} strokeWidth={1.8} />
        </span>
        <span className="text-sm font-semibold tracking-[-0.01em]">{t(language).appTitle}</span>
      </div>
      <div className="flex items-center gap-4">
        {screen !== 'gallery' && <span className="hidden text-xs text-stone-400 sm:block">{screen === 'difficulty' ? '02 / 03' : '03 / 03'}</span>}
        <LanguageSwitcher language={language} onChange={onLanguageChange} />
      </div>
    </header>
  );
}
