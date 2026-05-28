'use client'

import { ThemeProvider } from 'next-themes'
import React, { ReactNode } from 'react'

// Suppress React 19 "Encountered a script tag" warning from next-themes during development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const origError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' && 
      (args[0].includes('Encountered a script tag') || args[0].includes('extra attributes from the server'))
    ) {
      return;
    }
    origError.apply(console, args);
  };
}

export default function ThemeProviderContext({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      {children}
    </ThemeProvider>
  )
}
