'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import type { AnalysisResult } from '@/types/analysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpDown, Filter, History as HistoryIcon, Search, Smile, XCircle, Tags } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type SortOrder = 'date-desc' | 'date-asc';

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>('date-desc');
  const [filterTag, setFilterTag] = useState('');
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('histifyHistory');
      if (storedHistory) {
        const parsedHistory: AnalysisResult[] = JSON.parse(storedHistory);
        setHistoryItems(parsedHistory);

        const allTags = parsedHistory.flatMap(item => item.tags || []);
        const distinctTags = Array.from(new Set(allTags)).sort();
        setUniqueTags(distinctTags);
      }
    } catch (error) {
      console.error("Error loading history from localStorage:", error);
      // Potentially show a toast to the user
    }
    setIsLoading(false);
  }, []);

  const filteredAndSortedHistory = useMemo(() => {
    let items = [...historyItems];

    if (filterTag) {
      items = items.filter(item =>
        item.tags?.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase()))
      );
    }

    items.sort((a, b) => {
      const dateA = new Date(a.id).getTime(); // id is ISO date string
      const dateB = new Date(b.id).getTime();
      return sortOrder === 'date-desc' ? dateB - dateA : dateA - dateB;
    });

    return items;
  }, [historyItems, filterTag, sortOrder]);
  
  const suggestedTags = useMemo(() => {
    if (!filterTag) {
      return uniqueTags.slice(0, 10); // Show some initial suggestions
    }
    return uniqueTags.filter(tag => tag.toLowerCase().includes(filterTag.toLowerCase())).slice(0,10);
  }, [uniqueTags, filterTag]);

  const handleClearFilters = useCallback(() => {
    setFilterTag('');
    setSortOrder('date-desc');
  }, []);

  if (isLoading) {
    return <div className="p-6 text-center text-muted-foreground">Loading history...</div>;
  }

  return (
    <TooltipProvider>
      <div 
        className="min-h-screen py-8 px-4 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
        data-bg-ai-hint="historical manuscript"
      >
        <div className="container mx-auto max-w-4xl">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold font-serif text-primary flex items-center justify-center gap-3">
              <HistoryIcon className="h-10 w-10" />
              Analysis History
            </h1>
            <p className="text-lg text-foreground/80 mt-2">Review your past image analyses.</p>
          </header>

          {/* Filter and Sort Controls */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 p-4 bg-card/80 backdrop-blur-md rounded-lg shadow">
            <div className="flex items-center gap-2">
              <Popover open={isTagPopoverOpen} onOpenChange={setIsTagPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-9">
                    <Filter className="mr-2 h-4 w-4" />
                    {filterTag ? `Tag: ${filterTag}` : "Filter by tag..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0">
                  <div className="p-2">
                    <Input
                      placeholder="Type a tag..."
                      value={filterTag}
                      onChange={(e) => setFilterTag(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  {suggestedTags.length > 0 && (
                    <ScrollArea className="h-[150px]">
                      <div className="p-1">
                      {suggestedTags.map(tag => (
                        <Button
                          key={tag}
                          variant="ghost"
                          className="w-full justify-start h-8 text-sm px-2"
                          onClick={() => {
                            setFilterTag(tag);
                            setIsTagPopoverOpen(false);
                          }}
                        >
                          {tag}
                        </Button>
                      ))}
                      </div>
                    </ScrollArea>
                  )}
                </PopoverContent>
              </Popover>

              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SelectTrigger className="w-[150px] h-9 text-sm">
                       <ArrowUpDown className="mr-2 h-4 w-4" />
                       <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                  </TooltipTrigger>
                  <TooltipContent><p>Sort by Date</p></TooltipContent>
                </Tooltip>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
             {(filterTag || sortOrder !== 'date-desc') && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleClearFilters} className="h-9 w-9">
                      <XCircle className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Clear Filters & Sort</p></TooltipContent>
                </Tooltip>
              )}
          </div>


          {filteredAndSortedHistory.length === 0 ? (
            <Card className="text-center py-12 bg-card/80 backdrop-blur-md shadow">
              <CardContent className="flex flex-col items-center">
                <Smile className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground">
                  {historyItems.length === 0 ? "No history items yet." : "No results match your filters."}
                </p>
                {historyItems.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">Upload an image on the Analyze page to get started!</p>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredAndSortedHistory.map((item) => (
                <Card key={item.id} className="shadow-md border-border/30 bg-card/90 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl font-serif text-primary">
                      Analysis from: {item.analysisDate}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      ID: {new Date(item.id).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground/80 mb-1 flex items-center gap-1.5">
                        <Tags className="h-4 w-4 text-accent" />
                        Tags:
                      </h4>
                      {item.tags && item.tags.length > 0 ? (
                         <div className="flex flex-wrap gap-1.5">
                            {item.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs bg-accent/20 border-accent/50">{tag}</Badge>)}
                         </div>
                      ) : <p className="text-xs text-muted-foreground">No tags.</p>}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground/80 mb-1">Summary:</h4>
                      <p className="text-sm text-foreground/90 leading-relaxed line-clamp-3">
                        {item.shortSummary}
                      </p>
                      {item.isHistorical && <p className="text-xs text-accent mt-1">Detailed summary was available.</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
