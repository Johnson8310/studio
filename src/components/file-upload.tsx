 "use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  isLoading: boolean;
}

export function FileUpload({ onFilesSelected, isLoading }: FileUploadProps) {
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles);
    // Simulate progress for visual feedback - replace with actual upload progress if needed
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 100);
    setTimeout(() => clearInterval(timer), 2000); // Stop simulation after 2 seconds
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isLoading,
    multiple: true, // Allow multiple file uploads
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ease-in-out ${
        isDragActive ? 'border-primary bg-accent/10' : 'border-border hover:border-primary'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      {isDragActive ? (
        <p className="text-primary">Drop the files here ...</p>
      ) : (
        <p className="text-muted-foreground">Drag 'n' drop some files here, or click to select files</p>
      )}
      <Button variant="outline" size="sm" className="mt-4" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Select Files'}
      </Button>
      {progress > 0 && progress < 100 && !isLoading && (
         <Progress value={progress} className="w-full mt-4 h-2" />
      )}
       {isLoading && (
         <Progress value={100} className="w-full mt-4 h-2 animate-pulse" />
      )}
    </div>
  );
}
