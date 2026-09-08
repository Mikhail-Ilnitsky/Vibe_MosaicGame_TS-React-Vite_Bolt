export interface ImageData {
  id: string;
  url: string;
  orientation: 'landscape' | 'portrait' | 'square';
  title: { ru: string; en: string };
}

export interface GridConfig {
  rows: number;
  cols: number;
  /** smaller-side piece count (N from 5 to 11) */
  n: number;
  /** pixel size of each square piece in the original image */
  pieceSize: number;
  /** cropped width in original pixels */
  cropW: number;
  /** cropped height in original pixels */
  cropH: number;
  /** original image natural width */
  naturalW: number;
  /** original image natural height */
  naturalH: number;
}

export interface PuzzlePiece {
  id: number;
  /** original column index (0-based) */
  origX: number;
  /** original row index (0-based) */
  origY: number;
}

export type Language = 'ru' | 'en';

export type Screen = 'gallery' | 'difficulty' | 'game';
