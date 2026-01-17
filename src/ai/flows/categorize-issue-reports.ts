'use server';

/**
 * @fileOverview This file contains the Genkit flow for categorizing issue reports.
 *
 * It exports:
 * - `categorizeIssueReport` - An async function that takes an issue report as input and returns its categorization.
 * - `CategorizeIssueReportInput` - The TypeScript type definition for the input schema of the flow.
 * - `CategorizeIssueReportOutput` - The TypeScript type definition for the output schema of the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeIssueReportInputSchema = z.object({
  description: z.string().describe('The description of the issue report.'),
  location: z.string().describe('The location of the issue.'),
  category: z.string().describe('The user-selected category of the issue.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of the issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CategorizeIssueReportInput = z.infer<typeof CategorizeIssueReportInputSchema>;

const CategorizeIssueReportOutputSchema = z.object({
  severity: z.enum(['low', 'medium', 'high']).describe('The severity of the issue.'),
  imageHint: z.string().optional().describe('A two-word hint for the image content, used for accessibility and searching for a better image.'),
});
export type CategorizeIssueReportOutput = z.infer<typeof CategorizeIssueReportOutputSchema>;

export async function categorizeIssueReport(input: CategorizeIssueReportInput): Promise<CategorizeIssueReportOutput> {
  return categorizeIssueReportFlow(input);
}

const categorizeIssueReportPrompt = ai.definePrompt({
  name: 'categorizeIssueReportPrompt',
  input: {schema: CategorizeIssueReportInputSchema},
  output: {schema: CategorizeIssueReportOutputSchema},
  prompt: `You are an AI assistant helping to assess civic issue reports. The user has already categorized the issue. Based on the description, location, category, and photo provided, determine the severity of the issue. Also provide a two-word "image hint" that describes the main subject of the photo.

Category: {{{category}}}
Description: {{{description}}}
Location: {{{location}}}
{{#if photoDataUri}}
Photo: {{media url=photoDataUri}}
{{/if}}

Response in JSON format.
`,
});

const categorizeIssueReportFlow = ai.defineFlow(
  {
    name: 'categorizeIssueReportFlow',
    inputSchema: CategorizeIssueReportInputSchema,
    outputSchema: CategorizeIssueReportOutputSchema,
  },
  async input => {
    const {output} = await categorizeIssueReportPrompt(input);
    return output!;
  }
);
