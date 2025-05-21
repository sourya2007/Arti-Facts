'use client';

import { useState, useEffect } from 'react';
import type { AnalysisResult } from '@/types/analysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Tag } from 'lucide-react';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const [showLongSummary, setShowLongSummary] = useState(false);
  const [typedLongSummary, setTypedLongSummary] = useState('');

  useEffect(() => {
    setTypedLongSummary(''); // Reset typed summary when result changes
    setShowLongSummary(false); // Reset show state
  }, [result]);

  useEffect(() => {
    if (showLongSummary && result.longSummary) {
      let i = 0;
      setTypedLongSummary(''); // Clear previous typed text
      const typingInterval = setInterval(() => {
        if (i < result.longSummary.length) {
          setTypedLongSummary((prev) => prev + result.longSummary.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 20); // Adjust typing speed (ms per character)
      return () => clearInterval(typingInterval);
    } else {
      setTypedLongSummary('');
    }
  }, [showLongSummary, result.longSummary]);

  return (
    <Card className="w-full mt-6 shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl font-serif text-primary flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Analysis Results
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Analyzed on: {result.analysisDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Generated Tags
          </h3>
          {result.tags && result.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-sm bg-accent/30 text-accent-foreground hover:bg-accent/50">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No tags generated.</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">Historical Summary</h3>
          <CardDescription className="text-base text-foreground/90 leading-relaxed summary-fade-in">
            {result.shortSummary}
          </CardDescription>

          {result.isHistorical && result.longSummary && (
            <div className="mt-4">
              <Button
                variant="link"
                onClick={() => setShowLongSummary(!showLongSummary)}
                className="p-0 h-auto text-primary hover:text-primary/80"
              >
                {showLongSummary ? 'Show less' : 'Would you like to know more?'}
              </Button>
              {showLongSummary && (
                <CardDescription className="mt-2 text-base text-foreground/90 leading-relaxed">
                  {typedLongSummary}
                </CardDescription>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
