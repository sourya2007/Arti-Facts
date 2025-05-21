'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import ResultsDisplay from '@/components/ResultsDisplay';
import type { AnalysisResult } from '@/types/analysis';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { generateRelevantImageTags } from '@/ai/flows/generate-tags';
import { generateHistoricalSummary } from '@/ai/flows/generate-historical-summary';
import { useToast } from '@/hooks/use-toast';

export default function AnalyzePage() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageAnalysis = async (imageDataUri: string) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setUploadedImage(imageDataUri);

    try {
      // Step 1: Generate Tags
      const tagsResponse = await generateRelevantImageTags({ photoDataUri: imageDataUri });
      const tags = tagsResponse.tags;

      if (!tags || tags.length === 0) {
        toast({
          title: "Analysis Incomplete",
          description: "Could not generate tags for the image.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Step 2: Generate Summary using tags
      // For the description, we can pass a generic one or combine tags.
      // The AI prompt for summary generation mentions using tags and description.
      const summaryResponse = await generateHistoricalSummary({ 
        tags,
        description: `Image with tags: ${tags.join(', ')}` 
      });

      const resultData: AnalysisResult = {
        id: new Date().toISOString(), // Unique ID for history
        imageUrl: imageDataUri, // Store for potential display, though be mindful of localStorage size
        tags,
        shortSummary: summaryResponse.shortSummary,
        longSummary: summaryResponse.longSummary,
        isHistorical: summaryResponse.isHistorical,
        analysisDate: new Date().toLocaleDateString(),
      };
      setAnalysisResult(resultData);
      saveToHistory(resultData);

    } catch (error) {
      console.error('Error during image analysis:', error);
      toast({
        title: "Analysis Error",
        description: "An error occurred during image analysis. Please try again.",
        variant: "destructive",
      });
      setAnalysisResult(null); // Clear previous results on error
    } finally {
      setIsLoading(false);
    }
  };

  const saveToHistory = (result: AnalysisResult) => {
    try {
      const historyString = localStorage.getItem('histifyHistory');
      let history: AnalysisResult[] = historyString ? JSON.parse(historyString) : [];
      
      // Create a new result without the full imageDataUri for localStorage
      const historyEntry = { ...result, imageUrl: '' }; // Don't store full image data in history

      history.unshift(historyEntry); // Add new result to the beginning
      if (history.length > 5) {
        history = history.slice(0, 5); // Keep only the last 5 results
      }
      localStorage.setItem('histifyHistory', JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
      // This can happen if localStorage is full or disabled.
      // Optionally, inform the user.
       toast({
        title: "History Error",
        description: "Could not save to history. LocalStorage might be full or disabled.",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className="min-h-screen py-8 px-4 flex flex-col items-center bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1508614999368-9260051292e5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
      data-bg-ai-hint="historical texture"
    >
      <div className="w-full max-w-2xl bg-card/[.85] backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <ImageUploader onImageUploaded={handleImageAnalysis} isLoading={isLoading} />

        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-2 p-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-foreground">Analyzing image...</p>
          </div>
        )}

        {analysisResult && !isLoading && (
          <ResultsDisplay result={analysisResult} />
        )}
      </div>
    </div>
  );
}
