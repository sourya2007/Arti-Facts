export interface AnalysisResult {
  id: string; // Unique ID, can be timestamp
  imageUrl: string; // Data URI or URL of the image
  tags: string[];
  shortSummary: string;
  longSummary?: string; // Optional long summary
  isHistorical: boolean;
  analysisDate: string; // Formatted date string
}
