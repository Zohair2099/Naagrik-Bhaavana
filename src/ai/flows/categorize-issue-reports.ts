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
  mediaUrl: z.string().optional().describe('URL of attached media, if any'),
});
export type CategorizeIssueReportInput = z.infer<typeof CategorizeIssueReportInputSchema>;

const CategorizeIssueReportOutputSchema = z.object({
  category: z.string().describe('The category of the issue (e.g., potholes, street lighting, garbage).'),
  severity: z.enum(['low', 'medium', 'high']).describe('The severity of the issue.'),
});
export type CategorizeIssueReportOutput = z.infer<typeof CategorizeIssueReportOutputSchema>;

export async function categorizeIssueReport(input: CategorizeIssueReportInput): Promise<CategorizeIssueReportOutput> {
  return categorizeIssueReportFlow(input);
}

const categorizeIssueReportPrompt = ai.definePrompt({
  name: 'categorizeIssueReportPrompt',
  input: {schema: CategorizeIssueReportInputSchema},
  output: {schema: CategorizeIssueReportOutputSchema},
  prompt: `You are an AI assistant helping to categorize civic issue reports.  Based on the description and location provided in the issue report, determine the most appropriate category and severity.

Description: {{{description}}}
Location: {{{location}}}
{{#if mediaUrl}}Media URL: {{mediaUrl}}{{/if}}

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
