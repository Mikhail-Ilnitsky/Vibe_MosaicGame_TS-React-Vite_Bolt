import type { Language } from './types';

export const translations = {
  ru: {
    appTitle: 'Игра-мозаика',
    gallery: {
      title: 'Выберите картинку',
      subtitle: 'Нажмите на изображение, чтобы начать собирать мозаику',
    },
    difficulty: {
      title: 'Выберите сложность',
      subtitle: 'Чем больше фрагментов, тем сложнее',
      pieces: 'фрагментов',
      grid: (r: number, c: number) => `${r}×${c}`,
      back: 'Назад',
    },
    game: {
      moves: 'Ходы',
      back: 'К gallery',
      newGame: 'Начать новую игру',
      won: 'У вас получилось!',
      wonSubtitle: 'Вы собрали мозаику за {moves} ходов',
      preview: 'Оригинал',
      showPreview: 'Показать оригинал',
      hidePreview: 'Скрыть оригинал',
      shuffle: 'Перемешать',
    },
  },
  en: {
    appTitle: 'Puzzle Game',
    gallery: {
      title: 'Choose an image',
      subtitle: 'Click an image to start solving the puzzle',
    },
    difficulty: {
      title: 'Choose difficulty',
      subtitle: 'More pieces means more challenge',
      pieces: 'pieces',
      grid: (r: number, c: number) => `${r}×${c}`,
      back: 'Back',
    },
    game: {
      moves: 'Moves',
      back: 'Back to gallery',
      newGame: 'Start a new game',
      won: 'You did it!',
      wonSubtitle: 'You solved the puzzle in {moves} moves',
      preview: 'Original',
      showPreview: 'Show original',
      hidePreview: 'Hide original',
      shuffle: 'Shuffle',
    },
  },
} as const;

export function getInitialLanguage(): Language {
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language.toLowerCase();
    if (lang.startsWith('ru')) return 'ru';
  }
  return 'en';
}

export function t(lang: Language) {
  return translations[lang];
}
