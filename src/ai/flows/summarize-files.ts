'use server';

/**
 * @fileOverview Summarizes the content of files.
 *
 * - summarizeFiles - A function that summarizes the content of files.
 * - SummarizeFilesInput - The input type for the summarizeFiles function.
 * - SummarizeFilesOutput - The return type for the summarizeFiles function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeFilesInputSchema = z.object({
  fileContent: z.string().describe('The content of the file to summarize.'),
});
export type SummarizeFilesInput = z.infer<typeof SummarizeFilesInputSchema>;

const SummarizeFilesOutputSchema = z.object({
  summary: z.string().describe('A summary of the file content.'),
});
export type SummarizeFilesOutput = z.infer<typeof SummarizeFilesOutputSchema>;

export async function summarizeFiles(input: SummarizeFilesInput): Promise<SummarizeFilesOutput> {
  return summarizeFilesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeFilesPrompt',
  input: {
    schema: z.object({
      fileContent: z.string().describe('The content of the file to summarize.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A summary of the file content.'),
    }),
  },
  prompt: `Summarize the following file content in a concise manner:\n\n{{{fileContent}}}`,
});

const summarizeFilesFlow = ai.defineFlow<
  typeof SummarizeFilesInputSchema,
  typeof SummarizeFilesOutputSchema
>(
  {
    name: 'summarizeFilesFlow',
    inputSchema: SummarizeFilesInputSchema,
    outputSchema: SummarizeFilesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
