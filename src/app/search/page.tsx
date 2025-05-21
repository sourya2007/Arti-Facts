'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for search logic
    console.log('Searching for:', searchTerm);
    // In a real app, you would call an API or search local data here
  };

  return (
    <div 
      className="min-h-screen py-8 px-4 flex flex-col items-center bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
      data-bg-ai-hint="library archives"
    >
      <div className="container mx-auto max-w-2xl w-full">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold font-serif text-primary flex items-center justify-center gap-3">
            <SearchIcon className="h-10 w-10" />
            Search Histify
          </h1>
          <p className="text-lg text-foreground/80 mt-2">
            Find specific historical analyses or tags.
          </p>
        </header>

        <form onSubmit={handleSearch} className="w-full mb-8">
          <div className="flex items-center gap-2 bg-card/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-border/30">
            <Input
              type="search"
              placeholder="Search by tags, keywords, dates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow bg-transparent border-none focus:ring-0 text-foreground placeholder:text-muted-foreground text-sm"
            />
            <Button type="submit" size="icon" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <SearchIcon className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </form>

        {/* Placeholder for search results */}
        <Card className="bg-card/70 backdrop-blur-sm shadow">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Search results will appear here. This feature is currently under development.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
