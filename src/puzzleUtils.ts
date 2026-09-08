import type { GridConfig } from './types';

/**
 * Load the natural dimensions of an image.
 */
export function loadImage(url: string, timeoutMs = 8000): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => {
      reject(new Error(`Image load timed out: ${url}`));
    }, timeoutMs);
    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error(`Failed to load image: ${url}`));
    };
    img.src = url;
  });
}

/**
 * Generate all possible grid configs for a given image.
 * The smaller side is always divided into N pieces (N from 5 to 11).
 * The larger side gets floor(larger / pieceSize) pieces, with leftover pixels cropped.
 */
export function generateGrids(naturalW: number, naturalH: number): GridConfig[] {
  const grids: GridConfig[] = [];
  const minSide = Math.min(naturalW, naturalH);
  const isLandscape = naturalW >= naturalH;

  for (let n = 5; n <= 11; n++) {
    const pieceSize = Math.floor(minSide / n);
    if (pieceSize < 1) continue;

    const cols = isLandscape ? Math.floor(naturalW / pieceSize) : n;
    const rows = isLandscape ? n : Math.floor(naturalH / pieceSize);

    if (cols < 1 || rows < 1) continue;

    grids.push({
      rows,
      cols,
      n,
      pieceSize,
      cropW: cols * pieceSize,
      cropH: rows * pieceSize,
      naturalW,
      naturalH,
    });
  }

  return grids;
}

/**
 * Create the initial (solved) set of puzzle pieces.
 */
export function createPieces(rows: number, cols: number): number[] {
  const pieces: number[] = [];
  for (let i = 0; i < rows * cols; i++) {
    pieces.push(i);
  }
  return pieces;
}

/**
 * Fisher-Yates shuffle. Guarantees the result is not the solved state
 * (when there are at least 2 pieces).
 */
export function shufflePieces(pieces: number[]): number[] {
  const arr = [...pieces];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Ensure not already solved
  if (arr.length > 1 && arr.every((v, i) => v === i)) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }
  return arr;
}

/**
 * Check if the puzzle is solved (every piece is in its original position).
 */
export function isSolved(pieces: number[]): boolean {
  return pieces.every((v, i) => v === i);
}

/**
 * Convert a piece index to its original (x, y) grid coordinates.
 */
export function indexToXY(index: number, cols: number): { x: number; y: number } {
  return {
    x: index % cols,
    y: Math.floor(index / cols),
  };
}
