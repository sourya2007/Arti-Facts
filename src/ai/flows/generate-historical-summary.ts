'use server';
/**
 * @fileOverview A flow to generate a historical summary of an image.
 *
 * - generateHistoricalSummary - A function that handles the generation of the historical summary.
 * - GenerateHistoricalSummaryInput - The input type for the generateHistoricalSummary function.
 * - GenerateHistoricalSummaryOutput - The return type for the generateHistoricalSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHistoricalSummaryInputSchema = z.object({
  tags: z.array(z.string()).describe('The tags generated for the image.'),
  description: z.string().describe('A detailed description of the image.'),
});
export type GenerateHistoricalSummaryInput = z.infer<typeof GenerateHistoricalSummaryInputSchema>;

const GenerateHistoricalSummaryOutputSchema = z.object({
  shortSummary: z.string().describe('A short 1-2 sentence summary of the historical significance of the identified elements, or a message stating no elements of historical importance were detected.'),
  longSummary: z.string().describe('A longer more detailed summary if there is any historic significance, otherwise an empty string.'),
  isHistorical: z.boolean().describe('True if the image has historical significance, otherwise false.')
});
export type GenerateHistoricalSummaryOutput = z.infer<typeof GenerateHistoricalSummaryOutputSchema>;

export async function generateHistoricalSummary(input: GenerateHistoricalSummaryInput): Promise<GenerateHistoricalSummaryOutput> {
  return generateHistoricalSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHistoricalSummaryPrompt',
  input: {schema: GenerateHistoricalSummaryInputSchema},
  output: {schema: GenerateHistoricalSummaryOutputSchema},
  prompt: `You are an AI expert in identifying the historical significance of images.

CRITICAL INSTRUCTIONS:
* IGNORE PEOPLE AND ANIMALS: Do NOT consider any people or animals in the image for historical analysis. Your focus is solely on the background, surrounding locations, architecture, historical artifacts, and significant objects.
* FOCUS ON ENVIRONMENT: Analyze the image based on the surrounding details, architecture, and any historical objects present. The presence of people or animals is irrelevant to this analysis.
* ACCURACY AND CONTEXT: Ensure that your assessment is based on credible historical information and is free from personal opinions or speculation.
* EXAMPLES OF NON-HISTORICAL IMAGES: Portraits, paintings, close shots of people or animals, images focused on modern objects (cars, technology), landscapes without clear historical elements are examples of images where no historical importance will be found.
* NO BIAS: Provide an unbiased summary, free from any assumptions or stereotypes.

Your goal is to:
1. Determine if the image has any discernible historical landmarks, locations, or specific architectural elements.
2. If yes (isHistorical is true):
   - Generate a concise shortSummary (1-2 sentences) highlighting the historical significance.
   - Generate a more detailed longSummary to describe the historical importance of identified elements.
3. If no (isHistorical is false):
   - The shortSummary should be a very short message (maximum 2 sentences) stating that the image does not contain anything specific to our goal, for example: 'The image was analyzed, but a specific historical focus on a location, architecture, statue, or artifact could not be established.' or 'No location of importance or historical significance was found in the image.'
   - The longSummary must be an empty string.

NEW VALIDATION STEP:
* After generating shortSummary and longSummary (if applicable), you MUST critically review your own shortSummary. If isHistorical was true BUT the shortSummary fails to clearly discuss a specific historical location, landmark, architecture, statue, or artifact, you MUST change isHistorical to false, update the shortSummary to a message like 'The image was analyzed, but a specific historical focus on a location, architecture, statue, or artifact could not be established.', and ensure longSummary is an empty string.

FINAL REVIEW:
* Regardless of which type of summary is generated, you MUST perform a final review for grammatical errors and correct them before outputting.

Use the following as the primary source of information about the image.

Tags: {{{tags}}}
Description: {{{description}}}

Output the result in JSON format.
`
});

const generateHistoricalSummaryFlow = ai.defineFlow(
  {
    name: 'generateHistoricalSummaryFlow',
    inputSchema: GenerateHistoricalSummaryInputSchema,
    outputSchema: GenerateHistoricalSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

