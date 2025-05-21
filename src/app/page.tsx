'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Landmark } from 'lucide-react';

export default function LandingPage() {
  return (
    <section 
      className="flex min-h-screen items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
      data-ai-hint="historical abstract"
    >
      <div className="flex flex-col items-center justify-center bg-card/80 dark:bg-card/50 backdrop-blur-xl p-8 sm:p-12 md:p-16 rounded-3xl shadow-2xl text-center max-w-xl w-full animate-blur-fade-in">
        <div className="flex items-center gap-3 mb-6 animate-blur-fade-in" style={{ animationDelay: '0.2s' }}>
          <Landmark className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary">
            Histify
          </h1>
        </div>
        <p className="mt-4 text-lg sm:text-xl md:text-2xl text-foreground/80 mb-8 animate-blur-fade-in" style={{ animationDelay: '0.4s' }}>
          Welcome! Unveil the history hidden in your images. AI-Powered Historical Insights.
        </p>
        <Link href="/analyze" legacyBehavior>
          <Button 
            size="lg" 
            className="text-lg sm:text-xl py-3 px-8 bg-primary hover:bg-primary/90 text-primary-foreground animate-blur-fade-in" 
            style={{ animationDelay: '0.6s' }}
          >
            Analyze your image now
          </Button>
        </Link>
      </div>
    </section>
  );
}
