import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { ImageData, Language } from '@/types';
import { t } from '@/i18n';

const FALLBACK_ASPECT: Record<ImageData['orientation'], number> = {
  landscape: 1200 / 800,
  portrait: 800 / 1200,
  square: 1,
};

interface GalleryProps {
  images: ImageData[];
  language: Language;
  onSelect: (image: ImageData) => void;
}

interface GalleryItemProps {
  image: ImageData;
  index: number;
  language: Language;
  onSelect: (image: ImageData) => void;
}

function GalleryItem({ image, index, language, onSelect }: GalleryItemProps) {
  const [aspect, setAspect] = useState(FALLBACK_ASPECT[image.orientation]);

  const applyNaturalAspect = (img: HTMLImageElement) => {
    if (img.naturalHeight > 0) {
      setAspect(img.naturalWidth / img.naturalHeight);
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(image)}
      className="group relative max-w-full min-w-0 overflow-hidden rounded-2xl bg-stone-100 text-left shadow-[0_2px_20px_rgba(28,25,23,0.04)] transition-all duration-500 [--thumb-h:16rem] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(28,25,23,0.14)] focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-4 sm:[--thumb-h:18rem]"
      style={{
        aspectRatio: String(aspect),
        width: `min(100%, calc(var(--thumb-h) * ${aspect}))`,
      }}
      aria-label={image.title[language]}
    >
      <img
        src={image.url}
        alt={image.title[language]}
        className="h-full w-full object-contain"
        onLoad={(event) => applyNaturalAspect(event.currentTarget)}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent opacity-65 transition-opacity duration-300 group-hover:opacity-90" />
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white sm:p-5">
        <span>
          <span className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-white/70">0{index + 1}</span>
          <span className="block text-base font-medium sm:text-lg">{image.title[language]}</span>
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight size={17} strokeWidth={1.7} />
        </span>
      </span>
    </button>
  );
}

export function Gallery({ images, language, onSelect }: GalleryProps) {
  const copy = t(language).gallery;

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:px-12 lg:pt-20">
      <div className="mx-auto mb-12 max-w-xl text-center sm:mb-16">
        <div className="mb-5 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400">
          <span className="h-px w-8 bg-stone-200" />
          <span>01 / 03</span>
          <span className="h-px w-8 bg-stone-200" />
        </div>
        <h1 className="text-4xl font-medium tracking-[-0.04em] text-stone-900 sm:text-5xl">
          {copy.title}
        </h1>
        <p className="mt-4 text-sm leading-6 text-stone-500 sm:text-base">{copy.subtitle}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-5 lg:gap-7">
        {images.map((image, index) => (
          <GalleryItem key={image.id} image={image} index={index} language={language} onSelect={onSelect} />
        ))}
      </div>
    </main>
  );
}
