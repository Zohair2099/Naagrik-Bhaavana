'use server';

/**
 * @fileOverview Summarizes issue reports for admins.
 *
 * - summarizeIssueReports - A function that summarizes issue reports.
 * - SummarizeIssueReportsInput - The input type for the summarizeIssueReports function.
 * - SummarizeIssueReportsOutput - The return type for the summarizeIssueReports function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeIssueReportsInputSchema = z.object({
  reportDetails: z.string().describe('Details of the issue report.'),
});

export type SummarizeIssueReportsInput = z.infer<
  typeof SummarizeIssueReportsInputSchema
>;

const SummarizeIssueReportsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the issue report.'),
});

export type SummarizeIssueReportsOutput = z.infer<
  typeof SummarizeIssueReportsOutputSchema
>;

export async function summarizeIssueReports(
  input: SummarizeIssueReportsInput
): Promise<SummarizeIssueReportsOutput> {
  return summarizeIssueReportsFlow(input);
}

const summarizeIssueReportsPrompt = ai.definePrompt({
  name: 'summarizeIssueReportsPrompt',
  input: {schema: SummarizeIssueReportsInputSchema},
  output: {schema: SummarizeIssueReportsOutputSchema},
  prompt: `Summarize the following issue report details in a concise manner:\n\n{{{reportDetails}}}`,
});

const summarizeIssueReportsFlow = ai.defineFlow(
  {
    name: 'summarizeIssueReportsFlow',
    inputSchema: SummarizeIssueReportsInputSchema,
    outputSchema: SummarizeIssueReportsOutputSchema,
  },
  async input => {
    const {output} = await summarizeIssueReportsPrompt(input);
    return output!;
  }
);
