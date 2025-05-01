'use server';

/**
 * @fileOverview An AI agent that categorizes files into predefined categories.
 *
 * - categorizeFiles - A function that handles the file categorization process.
 * - CategorizeFilesInput - The input type for the categorizeFiles function.
 * - CategorizeFilesOutput - The return type for the categorizeFiles function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const CategorizeFilesInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A file's data, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  fileName: z.string().describe('The name of the file.'),
  categories: z
    .string()
    .array()
    .describe('The predefined categories to sort the files into.'),
});
export type CategorizeFilesInput = z.infer<typeof CategorizeFilesInputSchema>;

const CategorizeFilesOutputSchema = z.object({
  category: z
    .string()
    .describe('The category that the file belongs to, chosen from the categories provided.'),
  reason: z
    .string()
    .describe('The reasoning behind the categorization decision.'),
});
export type CategorizeFilesOutput = z.infer<typeof CategorizeFilesOutputSchema>;

export async function categorizeFiles(input: CategorizeFilesInput): Promise<CategorizeFilesOutput> {
  return categorizeFilesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeFilesPrompt',
  input: {
    schema: z.object({
      fileDataUri: z
        .string()
        .describe(
          "A file's data, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
      fileName: z.string().describe('The name of the file.'),
      categories: z
        .string()
        .array()
        .describe('The predefined categories to sort the files into.'),
    }),
  },
  output: {
    schema: z.object({
      category: z
        .string()
        .describe('The category that the file belongs to, chosen from the categories provided.'),
      reason: z
        .string()
        .describe('The reasoning behind the categorization decision.'),
    }),
  },
  prompt: `You are an AI file categorization expert.

You will be provided a file and a set of categories.
Your goal is to categorize the file into one of the provided categories.

Categories:
{{#each categories}}
- {{this}}
{{/each}}

File name: {{fileName}}
File data: {{media url=fileDataUri}}

Respond with the category the file belongs to, and the reasoning behind your decision.
`,
});

const categorizeFilesFlow = ai.defineFlow<
  typeof CategorizeFilesInputSchema,
  typeof CategorizeFilesOutputSchema
>(
  {
    name: 'categorizeFilesFlow',
    inputSchema: CategorizeFilesInputSchema,
    outputSchema: CategorizeFilesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
