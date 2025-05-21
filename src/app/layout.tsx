'use client';

import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { Georgia as FontSerif } from 'next/font/google'; // Example serif font
import './globals.css';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Note: Using a generic serif like Georgia. For "Microsoft Sans Serif" as primary sans,
// it's handled by tailwind.config.ts font stack.
// If specific "classic serif" is desired, ensure it's web-safe or properly imported.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [mainKey, setMainKey] = useState(pathname);

  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  useEffect(() => {
    setMainKey(pathname); // Update key on path change to trigger animation
  }, [pathname]);

  // Static metadata, can be moved to specific pages if dynamic metadata is needed.
  const metadata: Metadata = {
    title: 'Histify',
    description: 'Unveil the history hidden in your images.',
  };
  
  return (
    <html lang="en" className={cn(fontSans.variable)}>
      <body className="font-sans antialiased">
        {!isLandingPage && <Navbar />}
        <main
          key={mainKey} // Change key to re-trigger animation on route change
          className={cn(
            'min-h-screen',
            !isLandingPage && 'pt-16', // Add padding top if Navbar is visible
            !isInitialRender && 'animate-page-fade-in-blur'
          )}
        >
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
