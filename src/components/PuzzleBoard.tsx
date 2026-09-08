import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, RotateCcw } from 'lucide-react';
import type { GridConfig, ImageData, Language } from '@/types';
import { indexToXY, isSolved, shufflePieces } from '@/puzzleUtils';
import { t } from '@/i18n';

type WinPhase = 'playing' | 'flash' | 'reveal' | 'done';

interface PuzzleBoardProps {
  image: ImageData;
  language: Language;
  grid: GridConfig;
  onBack: () => void;
  onWon: () => void;
}

export function PuzzleBoard({ image, language, grid, onBack, onWon }: PuzzleBoardProps) {
  const copy = t(language).game;
  const total = grid.rows * grid.cols;
  const [pieces, setPieces] = useState<number[]>(() => shufflePieces(Array.from({ length: total }, (_, i) => i)));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [winPhase, setWinPhase] = useState<WinPhase>('playing');
  const didMove = useRef(false);
  const dragOrigin = useRef<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const hasWon = isSolved(pieces);
  const interactive = winPhase === 'playing';
  const showingSolvedImage = winPhase === 'reveal' || winPhase === 'done';

  useEffect(() => {
    if (hasWon) onWon();
  }, [hasWon, onWon]);

  useEffect(() => {
    if (!hasWon) return;
    setWinPhase('flash');
    const revealTimer = window.setTimeout(() => setWinPhase('reveal'), 250);
    const doneTimer = window.setTimeout(() => setWinPhase('done'), 650);
    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(doneTimer);
    };
  }, [hasWon]);

  const swapPieces = (from: number, to: number) => {
    if (from === to) return;
    setPieces((current) => {
      const next = [...current];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
    setMoves((current) => current + 1);
  };

  const getCellIndex = (clientX: number, clientY: number): number | null => {
    const element = document.elementFromPoint(clientX, clientY);
    const cell = element?.closest<HTMLElement>('[data-puzzle-cell]');
    if (!cell || !boardRef.current?.contains(cell)) return null;
    const value = Number(cell.dataset.puzzleCell);
    return Number.isInteger(value) ? value : null;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>, index: number) => {
    if (!interactive) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragOrigin.current = index;
    didMove.current = false;
    setDragIndex(index);
    setHoverIndex(index);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || dragOrigin.current === null) return;
    const nextIndex = getCellIndex(event.clientX, event.clientY);
    if (nextIndex !== null) {
      setHoverIndex(nextIndex);
      if (nextIndex !== dragOrigin.current) didMove.current = true;
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const origin = dragOrigin.current;
    const target = getCellIndex(event.clientX, event.clientY) ?? hoverIndex;
    if (origin !== null && target !== null && target !== origin && didMove.current) {
      swapPieces(origin, target);
    }
    dragOrigin.current = null;
    setDragIndex(null);
    setHoverIndex(null);
  };

  const handleClick = (index: number) => {
    if (!interactive) return;
    if (didMove.current) {
      didMove.current = false;
      return;
    }
    if (selectedIndex === null) {
      setSelectedIndex(index);
      return;
    }
    if (selectedIndex === index) {
      setSelectedIndex(null);
      return;
    }
    swapPieces(selectedIndex, index);
    setSelectedIndex(null);
  };

  const handleShuffle = () => {
    if (!interactive) return;
    setPieces((current) => shufflePieces(current));
    setSelectedIndex(null);
    setMoves((current) => current + 1);
  };

  const backgroundSize = `${grid.cols * 100}% ${grid.rows * 100}%`;

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-16 pt-7 sm:px-8 sm:pt-10 lg:px-12">
      <div className="mb-7 flex items-center justify-between sm:mb-10">
        <button type="button" onClick={onBack} className="group inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-stone-900">
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          {copy.back}
        </button>
        <div className="flex items-center gap-3">
          <div className="hidden text-xs text-stone-400 sm:block">{copy.moves}</div>
          <div className="min-w-9 rounded-full bg-stone-100 px-3 py-1.5 text-center text-xs font-semibold text-stone-700">{moves}</div>
          <button type="button" onClick={handleShuffle} disabled={!interactive} className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition-colors hover:border-stone-900 hover:text-stone-900 disabled:pointer-events-none disabled:opacity-40" aria-label={copy.shuffle}>
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[min(88vw,760px)] text-center">
        <div className="mb-7 sm:mb-9">
          <h1 className="text-3xl font-medium tracking-[-0.04em] text-stone-900 sm:text-4xl">{image.title[language]}</h1>
          <p className="mt-2 text-sm text-stone-400">{grid.rows}×{grid.cols}</p>
        </div>

        <div className="relative mx-auto w-full max-w-full">
          <div
            className="relative w-full overflow-hidden rounded-lg border border-stone-200 bg-stone-100 shadow-[0_12px_40px_rgba(28,25,23,0.12)]"
            style={{ aspectRatio: `${grid.cols} / ${grid.rows}` }}
          >
            {!showingSolvedImage && (
              <div
                ref={boardRef}
                className="grid h-full w-full max-w-full touch-none"
                style={{ gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))` }}
                onPointerMove={handlePointerMove}
              >
                {pieces.map((pieceId, index) => {
                  const { x, y } = indexToXY(pieceId, grid.cols);
                  const positionX = grid.cols > 1 ? (x / (grid.cols - 1)) * 100 : 0;
                  const positionY = grid.rows > 1 ? (y / (grid.rows - 1)) * 100 : 0;
                  const isSelected = selectedIndex === index;
                  const isDragged = dragIndex === index;
                  const isHoverTarget = hoverIndex === index && dragIndex !== index;

                  return (
                    <div
                      key={`${pieceId}-${index}`}
                      data-puzzle-cell={index}
                      role="button"
                      tabIndex={interactive ? 0 : -1}
                      aria-label={`Puzzle piece ${pieceId + 1}`}
                      className={`relative min-w-0 cursor-grab select-none border-[0.5px] border-white/60 bg-stone-200 bg-no-repeat transition-[transform,outline] duration-200 active:cursor-grabbing ${isSelected ? 'piece-select' : ''} ${isDragged ? 'z-10 scale-[0.96] brightness-110' : ''} ${isHoverTarget ? 'outline outline-2 outline-stone-900/50 outline-offset-[-2px]' : ''} ${winPhase === 'flash' ? 'animate-win-flash' : ''}`}
                      style={{
                        aspectRatio: '1',
                        backgroundImage: `url(${image.url})`,
                        backgroundSize,
                        backgroundPosition: `${positionX}% ${positionY}%`,
                      }}
                      onPointerDown={(event) => handlePointerDown(event, index)}
                      onPointerUp={handlePointerUp}
                      onPointerCancel={handlePointerUp}
                      onClick={() => handleClick(index)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') handleClick(index);
                      }}
                    />
                  );
                })}
              </div>
            )}

            {showingSolvedImage && (
              <img
                src={image.url}
                alt={image.title[language]}
                className="absolute inset-0 h-full w-full object-cover animate-fade-in"
              />
            )}
          </div>

          {showPreview && interactive && (
            <div className="absolute inset-0 z-20 overflow-hidden rounded-lg animate-fade-in">
              <img src={image.url} alt={copy.preview} className="absolute inset-0 h-full w-full object-cover" />
            </div>
          )}
        </div>

        {interactive && (
          <button type="button" onClick={() => setShowPreview((current) => !current)} className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-stone-400 transition-colors hover:text-stone-900">
            {showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
            {showPreview ? copy.hidePreview : copy.showPreview}
          </button>
        )}

        {winPhase === 'done' && (
          <div className="mt-10 animate-fade-in-up rounded-2xl border border-stone-200 bg-stone-50 px-6 py-7 sm:mt-14 sm:px-10">
            <p className="text-2xl font-medium tracking-[-0.04em] text-stone-900 sm:text-3xl">{copy.won}</p>
            <p className="mt-2 text-sm text-stone-500">{copy.wonSubtitle.replace('{moves}', String(moves))}</p>
            <button type="button" onClick={onBack} className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-stone-900 px-6 text-sm font-medium text-white transition-all hover:bg-stone-700 hover:shadow-lg">
              {copy.newGame}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
