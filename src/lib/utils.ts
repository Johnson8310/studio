import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import React from 'react'; // Keep React import for JSX
import {
  FileText,
  Image as ImageIcon, // Rename Image to avoid conflict with DOM Image
  Video,
  Music,
  FileArchive, // Added for archives
  Code,        // Added for code
  FileQuestion // Keep default
} from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function readFileAsDataURI(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as Data URI.'));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}

// Helper function to get file type icon based on MIME type or category name
export function getFileIcon(mimeOrCategory: string): React.ReactNode {
  const commonClass = "w-5 h-5 shrink-0"; // Consistent size and prevent shrinking

  // Prioritize specific MIME types
  if (mimeOrCategory.startsWith('image/')) {
    // Ensure correct JSX syntax
    const iconClassName = `${commonClass} text-accent`;
    return <ImageIcon className={iconClassName} />; // Use theme color
  }
  if (mimeOrCategory.startsWith('video/')) {
     const iconClassName = `${commonClass} text-primary`;
    return <Video className={iconClassName} />; // Use theme color
  }
  if (mimeOrCategory.startsWith('audio/')) {
     const iconClassName = `${commonClass} text-secondary-foreground`;
    return <Music className={iconClassName} />; // Use theme color
  }
  if (mimeOrCategory === 'application/pdf' || mimeOrCategory.startsWith('text/plain') || mimeOrCategory.startsWith('application/msword') || mimeOrCategory.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
     const iconClassName = `${commonClass} text-foreground`;
    return <FileText className={iconClassName} />; // Use theme color for general text/docs
  }
  if (mimeOrCategory === 'application/zip' || mimeOrCategory === 'application/x-rar-compressed' || mimeOrCategory === 'application/x-7z-compressed' || mimeOrCategory === 'application/gzip' || mimeOrCategory === 'application/x-tar') {
     const iconClassName = `${commonClass} text-destructive`;
     return <FileArchive className={iconClassName} />; // Use theme color
  }
   // Basic check for common code file types - use text/ or application/ prefixes
  if (mimeOrCategory.startsWith('text/javascript') || mimeOrCategory.startsWith('application/javascript') || mimeOrCategory.startsWith('text/css') || mimeOrCategory.startsWith('text/html') || mimeOrCategory.startsWith('application/json') || mimeOrCategory.startsWith('application/xml') || mimeOrCategory.startsWith('text/x-python') || mimeOrCategory.startsWith('application/x-python-code') || mimeOrCategory.startsWith('text/markdown') || mimeOrCategory.startsWith('text/typescript') || mimeOrCategory.startsWith('application/typescript')) {
     const iconClassName = `${commonClass} text-muted-foreground`;
     return <Code className={iconClassName} />; // Use theme color
  }

  // Fallback to category names if it doesn't look like a standard MIME type
  // (This is a heuristic, might need adjustment based on actual usage)
  if (!mimeOrCategory.includes('/')) {
      switch (mimeOrCategory.toLowerCase()) {
          case 'documents': return <FileText className={`${commonClass} text-foreground`} />;
          case 'images': return <ImageIcon className={`${commonClass} text-accent`} />;
          case 'videos': return <Video className={`${commonClass} text-primary`} />;
          case 'audio': return <Music className={`${commonClass} text-secondary-foreground`} />;
          case 'archives': return <FileArchive className={`${commonClass} text-destructive`} />;
          case 'code': return <Code className={`${commonClass} text-muted-foreground`} />;
          default: return <FileQuestion className={`${commonClass} text-muted-foreground`} />;
      }
  }

  // Default icon if no specific type or category matches
  return <FileQuestion className={`${commonClass} text-muted-foreground`} />;
}
