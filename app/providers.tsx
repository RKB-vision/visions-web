'use client';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/src/components/ui/theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}