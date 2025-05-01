 "use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getFileIcon } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export interface CategorizedFile {
  id: string;
  name: string;
  mimeType: string;
  category: string;
  reason?: string;
  summary?: string;
  isLoading?: boolean; // Flag for loading state
}

interface FileListProps {
  files: CategorizedFile[];
  title: string;
  description?: string;
}

export function FileList({ files, title, description }: FileListProps) {
  if (!files || files.length === 0) {
    return (
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No files to display yet.</p>
        </CardContent>
      </Card>
    );
  }

  const groupedFiles = files.reduce((acc, file) => {
    const category = file.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(file);
    return acc;
  }, {} as Record<string, CategorizedFile[]>);

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {Object.entries(groupedFiles).map(([category, categoryFiles]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-primary">{category}</h3>
              <ul className="space-y-3">
                {categoryFiles.map((file) => (
                   <li key={file.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md transition-colors hover:bg-secondary/60">
                    {file.isLoading ? (
                      <div className="flex items-center space-x-3 flex-grow">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <div className="space-y-1 flex-grow">
                           <Skeleton className="h-4 w-3/4" />
                           <Skeleton className="h-3 w-1/2" />
                         </div>
                         <Skeleton className="h-5 w-20 rounded-full" />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center space-x-3 flex-grow overflow-hidden">
                          {getFileIcon(file.mimeType)}
                          <div className="flex-grow overflow-hidden">
                             <p className="text-sm font-medium truncate" title={file.name}>
                               {file.name}
                             </p>
                            {file.summary && (
                              <p className="text-xs text-muted-foreground truncate" title={file.summary}>
                                Summary: {file.summary}
                              </p>
                            )}
                             {file.reason && (
                               <p className="text-xs text-muted-foreground truncate" title={file.reason}>
                                 Reason: {file.reason}
                               </p>
                             )}
                          </div>
                        </div>
                         <Badge variant="outline" className="ml-auto flex-shrink-0">{file.category}</Badge>
                      </>
                    )}
                   </li>
                ))}
              </ul>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
