'use client';

import { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, XCircle, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUploaded: (imageDataUri: string) => void;
  isLoading: boolean;
}

export default function ImageUploader({ onImageUploaded, isLoading }: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload an image file (e.g., JPG, PNG, GIF).',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // You can add more visual cues for drag over if needed
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    // Also clear file input if necessary, though it's hidden
    const fileInput = document.getElementById('imageUploadInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleAnalyze = () => {
    if (imagePreview) {
      onImageUploaded(imagePreview);
    } else {
      toast({
        title: 'No Image Selected',
        description: 'Please upload an image before analyzing.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-serif text-primary">Upload Your Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {imagePreview ? (
          <div className="relative group aspect-video w-full max-h-[400px] rounded-lg overflow-hidden border-2 border-dashed border-border flex items-center justify-center">
            <Image
              src={imagePreview}
              alt="Uploaded preview"
              layout="fill"
              objectFit="contain"
              className="transition-opacity duration-300"
            />
            <Button
              variant="destructive"
              size="icon"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive/80 hover:bg-destructive rounded-full h-8 w-8"
              aria-label="Remove image"
            >
              <XCircle className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors
              ${isDragging ? 'border-primary bg-accent/50' : 'border-border hover:border-accent'}`}
            onClick={() => document.getElementById('imageUploadInput')?.click()}
          >
            <UploadCloud className={`h-12 w-12 mb-3 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className={`text-center text-sm ${isDragging ? 'text-primary' : 'text-muted-foreground'}`}>
              Drag & drop an image here, or click to select a file.
            </p>
            <input
              id="imageUploadInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}
        <Button
          onClick={handleAnalyze}
          disabled={isLoading || !imagePreview}
          className={`w-full text-lg py-3 ${isLoading ? 'button-pulse-animation' : ''} bg-primary hover:bg-primary/90 text-primary-foreground`}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Image'}
        </Button>
      </CardContent>
    </Card>
  );
}
