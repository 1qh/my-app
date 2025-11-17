'use client'

import type * as React from 'react'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <NextThemesProvider attribute='class' defaultTheme='system' disableTransitionOnChange enableColorScheme enableSystem>
    {children}
  </NextThemesProvider>
)
