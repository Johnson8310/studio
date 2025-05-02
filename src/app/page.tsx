 "use client";

import React, { useState, useCallback } from 'react';
import { FileUpload } from '@/components/file-upload';
import { FileList, type CategorizedFile } from '@/components/file-list';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { categorizeFiles } from '@/ai/flows/categorize-files';
import { summarizeFiles } from '@/ai/flows/summarize-files';
import { readFileAsDataURI } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import SortlyAiLogo from '@/components/sortly-ai-logo'; // Corrected import

const PREDEFINED_CATEGORIES = ['Documents', 'Images', 'Videos', 'Audio', 'Archives', 'Code', 'Other'];

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [categorizedFilesState, setCategorizedFilesState] = useState<CategorizedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    // Reset categorized state when new files are selected
    setCategorizedFilesState([]);
  };

  const processFiles = useCallback(async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select some files to process.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Create initial state with loading indicators
    const initialCategorizedState = files.map((file, index) => ({
        id: `${file.name}-${index}`, // Simple unique ID
        name: file.name,
        mimeType: file.type || 'unknown',
        category: 'Processing...',
        isLoading: true,
      }));
    setCategorizedFilesState(initialCategorizedState);

    try {
        const processingPromises = files.map(async (file, index) => {
          let categoryResult: { category: string; reason: string } = { category: 'Error', reason: 'Processing failed' };
          let summaryResult: { summary: string } = { summary: 'N/A' };
          let dataUri: string | null = null;

          try {
            dataUri = await readFileAsDataURI(file);

            // Categorize
            categoryResult = await categorizeFiles({
              fileDataUri: dataUri,
              fileName: file.name,
              categories: PREDEFINED_CATEGORIES,
            });

            // Summarize (optional, only for text-based files for better results)
            if (file.type.startsWith('text/') || file.type === 'application/pdf') {
              // Extract text content for summarization - simplistic approach
              // For production, you'd need a more robust text extraction method (e.g., for PDFs)
              const fileContent = file.type.startsWith('text/') ? await file.text() : 'Content preview not available for this file type.';
              if (fileContent.length > 10) { // Only summarize if there's enough content
                 summaryResult = await summarizeFiles({ fileContent: fileContent.substring(0, 5000) }); // Limit content length
              } else {
                  summaryResult.summary = "Content too short to summarize.";
              }
            } else {
               summaryResult.summary = "Summary not applicable for this file type.";
            }

            return {
              id: initialCategorizedState[index].id,
              name: file.name,
              mimeType: file.type || 'unknown',
              category: categoryResult.category,
              reason: categoryResult.reason,
              summary: summaryResult.summary,
              isLoading: false, // Mark as done
            };

          } catch (error: any) {
             console.error(`Error processing file ${file.name}:`, error);
             toast({
                title: `Error processing ${file.name}`,
                description: error.message || "An unknown error occurred during AI processing.",
                variant: "destructive",
             });
             // Update specific file state to show error
             return {
               id: initialCategorizedState[index].id,
               name: file.name,
               mimeType: file.type || 'unknown',
               category: 'Error',
               reason: `Failed: ${error.message?.substring(0, 100) || 'Unknown error'}`,
               summary: 'N/A',
               isLoading: false, // Mark as done (with error)
             };
          }
        });

        // Update state progressively as each promise resolves
        for (const promise of processingPromises) {
          const result = await promise;
           setCategorizedFilesState(prevState =>
             prevState.map(f => f.id === result.id ? result : f)
           );
        }

        toast({
          title: "Processing Complete",
          description: "Files have been categorized and summarized.",
        });

    } catch (error: any) {
        console.error("Error during batch processing:", error);
        toast({
          title: "Processing Error",
          description: "An error occurred while processing the files.",
          variant: "destructive",
        });
         // Update all loading files to show error state
        setCategorizedFilesState(prevState => prevState.map(f => f.isLoading ? { ...f, category: 'Error', reason: 'Batch processing failed', isLoading: false } : f));
    } finally {
       setIsLoading(false);
       // Ensure all loading states are removed even if some intermediate updates failed
       setCategorizedFilesState(prevState => prevState.map(f => ({ ...f, isLoading: false })));
    }
  }, [files, toast]);

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col">
       <header className="mb-8 flex flex-col items-center gap-4 text-center">
         <SortlyAiLogo /> {/* Render the imported logo component */}
         <div className="text-center">
           <h1 className="text-4xl font-bold text-primary">
             SortlyAI
           </h1>
           <p className="text-lg text-muted-foreground mt-2">
             Intelligently sort and categorize your files with the power of AI.
           </p>
         </div>
       </header>

      <main className="flex-grow flex flex-col gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>1. Upload Your Files</CardTitle>
            <CardDescription>
               This app currently requires you to manually select files. Automatic file pulling from devices is not supported. Select or drag and drop the files you want to organize.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload onFilesSelected={handleFilesSelected} isLoading={isLoading} />
            {files.length > 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                Selected {files.length} file(s): {files.map(f => f.name).join(', ')}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
           <Button
             onClick={processFiles}
             disabled={isLoading || files.length === 0}
             size="lg"
             className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
           >
             {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
             ) : (
               'Start Sorting & Categorizing'
             )}
           </Button>
         </div>


        <Separator className="my-4" />

        <Card className="shadow-lg flex-grow">
           <CardHeader>
             <CardTitle>2. Organized Files</CardTitle>
             <CardDescription>
               View your files automatically sorted into categories by AI.
             </CardDescription>
           </CardHeader>
           <CardContent>
            <FileList
                files={categorizedFilesState}
                title="Categorized Files"
                description="Files sorted by AI based on content and type."
            />
           </CardContent>
         </Card>
      </main>

      <footer className="mt-12 text-center text-sm text-muted-foreground py-4 border-t">
        © {new Date().getFullYear()} SortlyAI. Powered by AI.
      </footer>
    </div>
  );
}
