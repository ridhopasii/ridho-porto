'use client';
import { createContext, useContext, useEffect } from 'react';

const AccentContext = createContext();

export default function AccentProvider({ color, children }) {
  useEffect(() => {
    if (!color) return;

    // Convert Hex to RGB for the --accent-rgb variable
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '20, 184, 166';
    };

    const root = document.documentElement;
    root.style.setProperty('--accent', color);
    root.style.setProperty('--accent-rgb', hexToRgb(color));
  }, [color]);

  return <AccentContext.Provider value={color}>{children}</AccentContext.Provider>;
}
