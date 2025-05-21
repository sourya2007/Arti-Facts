'use server';
/**
 * @fileOverview Generates relevant tags for images, focusing on historic locations, landmarks, and architecture.
 *
 * - generateRelevantImageTags - A function that generates tags for an image.
 * - GenerateRelevantImageTagsInput - The input type for the generateRelevantImageTags function.
 * - GenerateRelevantImageTagsOutput - The return type for the generateRelevantImageTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRelevantImageTagsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateRelevantImageTagsInput = z.infer<typeof GenerateRelevantImageTagsInputSchema>;

const GenerateRelevantImageTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of relevant tags for the image.'),
});
export type GenerateRelevantImageTagsOutput = z.infer<typeof GenerateRelevantImageTagsOutputSchema>;

export async function generateRelevantImageTags(input: GenerateRelevantImageTagsInput): Promise<GenerateRelevantImageTagsOutput> {
  return generateRelevantImageTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRelevantImageTagsPrompt',
  input: {schema: GenerateRelevantImageTagsInputSchema},
  output: {schema: GenerateRelevantImageTagsOutputSchema},
  prompt: `You are an expert AI that generates tags for images. Your primary goal is to identify and tag elements related to historic locations, landmarks, architecture, buildings, statues, and other significant historic symbols.

Analyze the image provided and generate a list of tags that are most relevant to these categories. 

CRITICAL INSTRUCTIONS:
- IGNORE PEOPLE AND ANIMALS: Do NOT consider any people or animals in the image for generating tags. Your focus is solely on the background, surrounding locations, architecture, historical artifacts, and significant objects.

Focus on identifying:
  - Historic Locations and Landmarks: Famous historical sites, ruins, or other places of historical significance.
  - Important Architecture: Notable buildings, monuments, statues, and other architectural structures with historical relevance.
  - Historic Symbols: Recognizable symbols associated with historical events or movements.

Prioritize tags that are specific and informative, allowing users to quickly understand the image's content. Limit the number of tags to the best 4.

Image: {{media url=photoDataUri}}

Tags: `,
});

const generateRelevantImageTagsFlow = ai.defineFlow(
  {
    name: 'generateRelevantImageTagsFlow',
    inputSchema: GenerateRelevantImageTagsInputSchema,
    outputSchema: GenerateRelevantImageTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

