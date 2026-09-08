import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import type { GridConfig, ImageData, Language } from '@/types';
import { t } from '@/i18n';

const FALLBACK_ASPECT: Record<ImageData['orientation'], number> = {
  landscape: 1200 / 800,
  portrait: 800 / 1200,
  square: 1,
};

interface DifficultySelectorProps {
  image: ImageData;
  language: Language;
  grids: GridConfig[];
  onBack: () => void;
  onSelect: (grid: GridConfig) => void;
}

export function DifficultySelector({ image, language, grids, onBack, onSelect }: DifficultySelectorProps) {
  const copy = t(language).difficulty;
  const aspect =
    grids.length > 0 && grids[0].naturalH > 0
      ? grids[0].naturalW / grids[0].naturalH
      : FALLBACK_ASPECT[image.orientation];

  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12 lg:px-12">
      <button type="button" onClick={onBack} className="group mb-10 inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-stone-900 sm:mb-14">
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        {copy.back}
      </button>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-16">
        <div>
          <div
            className="mb-5 w-full max-w-full overflow-hidden rounded-2xl bg-stone-100 shadow-sm"
            style={{ aspectRatio: String(aspect) }}
          >
            <img src={image.url} alt={image.title[language]} className="h-full w-full object-contain" />
          </div>
          <h1 className="text-3xl font-medium tracking-[-0.04em] text-stone-900 sm:text-4xl">{image.title[language]}</h1>
          <p className="mt-3 text-sm leading-6 text-stone-500">{copy.subtitle}</p>
        </div>

        <div className="lg:pt-2">
          <h2 className="text-3xl font-medium tracking-[-0.04em] text-stone-900 sm:text-4xl">{copy.title}</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {grids.map((grid, index) => (
              <button
                key={`${grid.rows}-${grid.cols}`}
                type="button"
                onClick={() => onSelect(grid)}
                className="group flex min-h-[100px] items-center justify-between rounded-2xl border border-stone-200 bg-white p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-stone-900 hover:shadow-[0_10px_30px_rgba(28,25,23,0.08)] focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2"
              >
                <span>
                  <span className="mb-2 block text-2xl font-medium tracking-[-0.04em] text-stone-900">{copy.grid(grid.rows, grid.cols)}</span>
                  <span className="text-xs text-stone-400">{grid.rows * grid.cols} {copy.pieces}</span>
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition-all group-hover:border-stone-900 group-hover:bg-stone-900 group-hover:text-white">
                  {index === 0 ? <Check size={15} /> : <ArrowRight size={15} />}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
