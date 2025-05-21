'use server';

/**
 * @fileOverview A Genkit flow that validates if the generated summary has historical relevance.
 *
 * The flow checks if the summary discusses a location, architecture, statue, or artifact.
 * If not, it cancels the summary to provide only relevant output.
 *
 * @interface ValidateHistoricalRelevanceInput - Input to the validateHistoricalRelevance flow.
 * @interface ValidateHistoricalRelevanceOutput - Output from the validateHistoricalRelevance flow.
 *
 * @function validateHistoricalRelevance - A function that validates the historical relevance of a summary.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateHistoricalRelevanceInputSchema = z.object({
  shortSummary: z.string().describe('A short summary of the image.'),
  isHistorical: z.boolean().describe('Whether the image is considered historical.'),
});
export type ValidateHistoricalRelevanceInput = z.infer<
  typeof ValidateHistoricalRelevanceInputSchema
>;

const ValidateHistoricalRelevanceOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the summary is valid based on historical relevance.'),
  validatedSummary: z.string().describe('The validated summary or a message indicating irrelevance.'),
});
export type ValidateHistoricalRelevanceOutput = z.infer<
  typeof ValidateHistoricalRelevanceOutputSchema
>;

export async function validateHistoricalRelevance(
  input: ValidateHistoricalRelevanceInput
): Promise<ValidateHistoricalRelevanceOutput> {
  return validateHistoricalRelevanceFlow(input);
}

const validateHistoricalRelevancePrompt = ai.definePrompt({
  name: 'validateHistoricalRelevancePrompt',
  input: {schema: ValidateHistoricalRelevanceInputSchema},
  output: {schema: ValidateHistoricalRelevanceOutputSchema},
  prompt: `You are an AI assistant tasked with validating the historical relevance of a summary.

  Instructions:
  - If isHistorical is false, return isValid as false and validatedSummary as the input shortSummary.
  - If isHistorical is true, check if the shortSummary discusses a location, architecture, statue, or artifact.
  - If the shortSummary discusses any of those, return isValid as true and validatedSummary as the input shortSummary.
  - If the shortSummary does not discuss any of those, return isValid as false and validatedSummary as "Summary is not relevant as it does not focus on location, architecture, statue, or artifact.".

  Input:
  shortSummary: {{{shortSummary}}}
  isHistorical: {{{isHistorical}}}

  Output:
  - isValid: Whether the summary is valid.
  - validatedSummary: The validated summary.
  `,
});

const validateHistoricalRelevanceFlow = ai.defineFlow(
  {
    name: 'validateHistoricalRelevanceFlow',
    inputSchema: ValidateHistoricalRelevanceInputSchema,
    outputSchema: ValidateHistoricalRelevanceOutputSchema,
  },
  async input => {
    const {output} = await validateHistoricalRelevancePrompt(input);
    return output!;
  }
);
