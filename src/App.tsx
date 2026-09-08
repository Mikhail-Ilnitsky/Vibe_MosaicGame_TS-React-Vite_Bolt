import { useEffect, useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { DifficultySelector } from '@/components/DifficultySelector';
import { Gallery } from '@/components/Gallery';
import { PuzzleBoard } from '@/components/PuzzleBoard';
import { IMAGES } from '@/data';
import { getInitialLanguage } from '@/i18n';
import { generateGrids, loadImage } from '@/puzzleUtils';
import type { GridConfig, ImageData, Language, Screen } from '@/types';

const FALLBACK_DIMENSIONS: Record<ImageData['orientation'], { width: number; height: number }> = {
  landscape: { width: 1200, height: 800 },
  portrait: { width: 800, height: 1200 },
  square: { width: 1000, height: 1000 },
};

function App() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [screen, setScreen] = useState<Screen>('gallery');
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [selectedGrid, setSelectedGrid] = useState<GridConfig | null>(null);
  const [grids, setGrids] = useState<GridConfig[]>([]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const handleImageSelect = async (image: ImageData) => {
    setSelectedImage(image);
    const fallback = FALLBACK_DIMENSIONS[image.orientation];
    try {
      const loaded = await loadImage(image.url);
      setGrids(generateGrids(loaded.naturalWidth, loaded.naturalHeight));
    } catch {
      setGrids(generateGrids(fallback.width, fallback.height));
    }
    setScreen('difficulty');
  };

  const handleDifficultySelect = (grid: GridConfig) => {
    setSelectedGrid(grid);
    setScreen('game');
  };

  const returnToGallery = () => {
    setScreen('gallery');
    setSelectedImage(null);
    setSelectedGrid(null);
    setGrids([]);
  };

  return (
    <div className="min-h-full bg-white">
      <AppHeader language={language} screen={screen} onLanguageChange={setLanguage} />
      {screen === 'gallery' && <Gallery images={IMAGES} language={language} onSelect={handleImageSelect} />}
      {screen === 'difficulty' && selectedImage && (
        <DifficultySelector image={selectedImage} language={language} grids={grids} onBack={returnToGallery} onSelect={handleDifficultySelect} />
      )}
      {screen === 'game' && selectedImage && selectedGrid && (
        <PuzzleBoard image={selectedImage} language={language} grid={selectedGrid} onBack={returnToGallery} onWon={() => undefined} />
      )}
    </div>
  );
}

export default App;
