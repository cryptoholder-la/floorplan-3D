"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import {
  ScaleOption,
  DEFAULT_SCALE,
  getScaleSettings,
  inchesToPixels as convertInchesToPixels,
  pixelsToInches as convertPixelsToInches,
} from '@/lib/unified-scale-utils';

interface ScaleContextType {
  scale: ScaleOption;
  setScale: (scale: ScaleOption) => void;
  inchesToPixels: (inches: number) => number;
  pixelsToInches: (pixels: number) => number;
  scaleSettings: ReturnType<typeof getScaleSettings>;
}

const ScaleContext = createContext<ScaleContextType | undefined>(undefined);

export function ScaleProvider({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState<ScaleOption>(DEFAULT_SCALE);

  const contextValue: ScaleContextType = {
    scale,
    setScale,
    inchesToPixels: (inches: number) => convertInchesToPixels(inches, scale),
    pixelsToInches: (pixels: number) => convertPixelsToInches(pixels, scale),
    scaleSettings: getScaleSettings(scale),
  };

  return (
    <ScaleContext.Provider value={contextValue}>
      {children}
    </ScaleContext.Provider>
  );
}

export function useScale() {
  const context = useContext(ScaleContext);
  if (!context) {
    throw new Error('useScale must be used within a ScaleProvider');
  }
  return context;
}
