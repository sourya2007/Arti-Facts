import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function AboutPage() {
  return (
    <div 
      className="min-h-screen py-8 px-4 flex items-center justify-center bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
      data-bg-ai-hint="old paper texture"
    >
      <div className="container mx-auto max-w-3xl">
        <Card className="bg-card/80 backdrop-blur-md shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Info className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-4xl font-bold font-serif text-primary">About Histify</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg text-foreground/90 leading-relaxed">
            <p>
              Histify is an innovative application designed to bridge the gap between your travel photos and the rich history embedded within them. 
              By leveraging cutting-edge AI, Histify analyzes your images to identify historical landmarks, significant architectural marvels, and important cultural symbols.
            </p>
            <p>
              Our mission is to make history more accessible and engaging. Whether you're a globetrotter, a history enthusiast, or simply curious about the stories behind places, Histify provides concise and insightful summaries, helping you discover and appreciate the historical context of your surroundings.
            </p>
            <p>
              Simply upload an image, and let Histify unveil the past!
            </p>
            <div className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Histify - Version 1.0.0
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
