# Контекст проекта: Игра-мозаика

## Назначение

Браузерная SPA-игра «мозаика» (пазл из квадратных фрагментов). Чистый фронтенд, без бэкенда и БД. Пользователь выбирает картинку → сложность (сетку) → собирает пазл перетаскиванием или клик-клик.

## Стек

| Технология | Версия (фактически) |
|------------|---------------------|
| React | 18.3 |
| TypeScript | 5.5 |
| Vite | 5.4 |
| Tailwind CSS | 3.4 |
| lucide-react | иконки |

> В исходном ТЗ указаны React 19 и Tailwind 4 — в проекте пока React 18 / Tailwind 3.

## Структура проекта

```
src/
├── App.tsx                 # Роутинг экранов, состояние игры
├── main.tsx
├── index.css               # Глобальные стили, анимации
├── data.ts                 # Mock-данные: массив IMAGES с URL картинок
├── types.ts                # ImageData, GridConfig, Language, Screen
├── i18n.ts                 # RU/EN локализация
├── puzzleUtils.ts          # Математика сетки, shuffle, loadImage
└── components/
    ├── AppHeader.tsx       # Логотип, шаг 01/02/03, переключатель языка
    ├── Gallery.tsx         # Галерея миниатюр
    ├── DifficultySelector.tsx
    ├── PuzzleBoard.tsx     # Игровое поле
    └── LanguageSwitcher.tsx
```

## Поток экранов

```
gallery → difficulty → game → (победа) → gallery
```

Состояние в `App.tsx`:
- `screen`: `'gallery' | 'difficulty' | 'game'`
- `selectedImage`, `selectedGrid`, `grids[]`

## Данные изображений

Файл: `src/data.ts`

Массив `IMAGES` — 6 картинок (landscape / portrait / square). Каждая запись:

```ts
{
  id: string;
  url: string;           // внешняя прямая ссылка (Pinterest, wallpaper и т.д.)
  orientation: 'landscape' | 'portrait' | 'square';
  title: { ru: string; en: string };
}
```

Картинки не нарезаются физически — фрагменты рендерятся через CSS `background-image`.

## Математика сетки (`puzzleUtils.ts`)

- Меньшая сторона делится на N частей, N = 5…11
- Большая сторона: `floor(larger / pieceSize)` — квадратные фрагменты
- Лишние пиксели обрезаются (центрирование через `object-cover` при показе оригинала)
- `generateGrids(naturalW, naturalH)` → массив `GridConfig`
- При ошибке загрузки — fallback-размеры по `orientation` в `App.tsx`

## Игровое поле (`PuzzleBoard.tsx`)

### Фрагменты (CSS, не canvas)
- Каждый фрагмент — `<div>` с `background-image`
- `background-size`: `(cols × 100%) (rows × 100%)`
- `background-position`: X = `x/(cols-1)*100%`, Y = `y/(rows-1)*100%`
- При перемешивании меняется только порядок в массиве `pieces`, не CSS-свойства фрагмента

### Управление
1. **Клик-клик** — выделение рамкой, обмен двух ячеек
2. **Pointer Events** (не HTML5 DnD) — `onPointerDown/Move/Up` для мыши и touch

### Responsive
- Контейнер: `max-w-[min(88vw,760px)]`, `w-full`
- Grid: `repeat(cols, minmax(0, 1fr))`, `aspectRatio: cols/rows`
- **Важный фикс:** `w-fit` заменён на `w-full` — иначе сетка схлопывалась до 0×0 px

### Анимация победы (`winPhase`)
| Фаза | Время | Поведение |
|------|-------|-----------|
| `flash` | 250 ms | Ячейки мигают (`animate-win-flash` в index.css) |
| `reveal` | +400 ms | Сетка скрывается, показывается целая картинка |
| `done` | — | Сообщение «У вас получилось!» + кнопка новой игры |

Ввод блокируется при `winPhase !== 'playing'`.

### Превью и оригинал
- Кнопка «Показать оригинал» — overlay поверх мозаики
- Оригинал и картинка после победы: `object-cover`, `absolute inset-0` — **тот же размер**, что и мозаика (без padding и letterbox)

## Галерея (`Gallery.tsx`)

### Требования (реализовано)
- Одинаковая высота миниатюр: `--thumb-h: 16rem` (sm: `18rem`)
- Ширина пропорциональна картинке: `width: min(100%, calc(var(--thumb-h) * aspect))`
- `object-contain` — картинка целиком, без обрезки
- Layout: `flex flex-wrap justify-center` (не фиксированная grid-cols)
- Пропорции: из `naturalWidth/naturalHeight` при `onLoad`, fallback по `orientation`
- **Узкие экраны:** `max-w-full` — широкие ландшафты не вылезают за край, масштабируются по ширине контейнера

## i18n

- Язык по умолчанию: `navigator.language` → RU если содержит `'ru'`, иначе EN
- Переключатель RU/EN в шапке
- `<title>`: «Игра-мозаика»

## Команды

```bash
npm run dev       # dev-сервер
npm run build     # production-сборка
npm run preview   # превью сборки
npm run lint      # ESLint
npm run typecheck # TypeScript
```

## История изменений (диалог)

1. **Диагностика пустого экрана игры** — причина: `w-fit` + CSS Grid `1fr` → нулевой размер поля. Исправлено: `w-full` на контейнере сетки.

2. **Галерея с пропорциями** — вместо одинаковых прямоугольников с `object-cover`: фиксированная высота, ширина по aspect ratio, `object-contain`, flex-wrap.

3. **Анимация победы** — flash → reveal (целая картинка) → сообщение о победе. CSS `@keyframes win-flash` в `index.css`.

4. **Адаптив галереи** — `min(100%, thumbH * aspect)` + `max-w-full` для телефонов.

5. **Оригинал = размер мозаики** — превью и win-reveal через `object-cover` без отступов, в той же рамке `aspectRatio: cols/rows`.

## Известные ограничения / TODO

- `cropW` / `cropH` в `GridConfig` вычисляются, но не используются при рендере фрагментов — обрезка визуально через `object-cover` только на превью/победе
- `@supabase/supabase-js` в dependencies не используется
- Внешние URL картинок могут перестать работать (hotlinking, CORS) — при сбое срабатывает fallback по orientation
- React 18 / Tailwind 3 вместо React 19 / Tailwind 4 из ТЗ

## Ключевые файлы для правок

| Задача | Файл |
|--------|------|
| Добавить/заменить картинки | `src/data.ts` |
| Логика сетки | `src/puzzleUtils.ts` |
| Галерея | `src/components/Gallery.tsx` |
| Игра, победа, превью | `src/components/PuzzleBoard.tsx` |
| Тексты RU/EN | `src/i18n.ts` |
| Анимации | `src/index.css` |
