'use server';
/**
 * @fileOverview A flow for generating extended historical summaries based on image analysis.
 *
 * The flow takes image analysis results as input and generates a detailed historical summary if the image is deemed to contain
 * historically significant elements. If not, it provides a short message indicating that no historical significance was found.
 *
 * @exported
 * - `generateExtendedHistoricalSummary`: The main function to trigger the flow.
 * - `GenerateExtendedHistoricalSummaryInput`: The input type for the function.
 * - `GenerateExtendedHistoricalSummaryOutput`: The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExtendedHistoricalSummaryInputSchema = z.object({
  imageDescription: z.string().describe('A description of the image content, focusing on historical aspects.'),
});
export type GenerateExtendedHistoricalSummaryInput = z.infer<typeof GenerateExtendedHistoricalSummaryInputSchema>;

const GenerateExtendedHistoricalSummaryOutputSchema = z.object({
  shortSummary: z.string().describe('A short, concise summary of the historical significance, if any.'),
  longSummary: z.string().describe('A more detailed summary of the historical significance, if any.'),
  isHistorical: z.boolean().describe('Indicates whether the image is deemed to contain historically significant elements.'),
});
export type GenerateExtendedHistoricalSummaryOutput = z.infer<typeof GenerateExtendedHistoricalSummaryOutputSchema>;

export async function generateExtendedHistoricalSummary(input: GenerateExtendedHistoricalSummaryInput): Promise<GenerateExtendedHistoricalSummaryOutput> {
  return generateExtendedHistoricalSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExtendedHistoricalSummaryPrompt',
  input: {schema: GenerateExtendedHistoricalSummaryInputSchema},
  output: {schema: GenerateExtendedHistoricalSummaryOutputSchema},
  prompt: `You are an AI expert in image analysis and historical interpretation.

  You will analyze the provided image description to determine if the image contains any elements of historical significance, such as locations, landmarks, specific architectural styles, or historically significant artifacts/objects.

  CRITICAL INSTRUCTIONS:

  - IGNORE PEOPLE AND ANIMALS: Do NOT consider any people or animals in the image for historical analysis. Your focus is solely on the background, surrounding locations, architecture, historical artifacts, and significant objects.
  - EXAMPLES OF NON-HISTORICAL IMAGES: Portraits, paintings, close shots of people or animals, images focused on modern objects (cars, technology), landscapes without clear historical elements are examples of images where no historical importance will be found.
  - FOCUS ON ENVIRONMENT: Do NOT account for people or any animal shown in the image. You should explicilty focus on the environment or surrounding
  - CRITICAL INSTRUCTIONS:
  Follow these instructions strictly:
  1.  Assessment of Historicity: Based on the image description, first determine if the image appears to depict a historical location, landmark, specific architectural style, or historically significant artifact/object. If it depicts people or animals, ignore them.
  2.  If the image does NOT contain any discernible historical elements: 
  Set isHistorical to false.
  shortSummary should be a concise message (maximum 2 sentences) stating that no location of importance or historical significance was found. Focus on environment and surrounding. Ignore people and animals
  longSummary should be an empty string. Make sure it is empty.
  3.  If the image DOES contain historical elements: 
  Set isHistorical to true.
  Generate a concise shortSummary (1-2 sentences) summarizing the historical significance of the identified elements. This should be a high-level overview.
  Generate a more detailed longSummary providing additional context and information about the historical elements. 
  4. Validation Step: Critically review your own shortSummary. If isHistorical was true but the shortSummary fails to clearly discuss a specific historical location, landmark, architecture, statue, or artifact, you must change isHistorical to false and update the shortSummary to a message like \"The image was analyzed, but a specific historical focus on a location, architecture, statue, or artifact could not be established.\" and ensure longSummary is empty.
  5. Grammar and Clarity: Ensure both summaries are grammatically correct and clearly written.
  6. Focus:  Make sure shortSummary and longSummary should be generated without considering any person, or animal in the image and without any bias to them.

  Image Description: {{{imageDescription}}}
`,
});

const generateExtendedHistoricalSummaryFlow = ai.defineFlow(
  {
    name: 'generateExtendedHistoricalSummaryFlow',
    inputSchema: GenerateExtendedHistoricalSummaryInputSchema,
    outputSchema: GenerateExtendedHistoricalSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
